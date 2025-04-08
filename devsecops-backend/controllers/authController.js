const { v4: uuidv4 } = require("uuid")
const jwt = require("jsonwebtoken")
const userSchema = require("../schemas/userSchema")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const response = require("../response")
const {
  createTable,
  checkRecordExists,
  insertRecord,
  getRecordByField,
} = require("../utils/sqlFunctions")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const pool = require("../db/connect") 

const poolInstance = pool; // Use the initialized pool instance

const generateAccessToken = (userid) => {
  return jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const register = async (req, res) => {
  try {
    const userId = uuidv4();
    const { username, email, password } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Check if user exists
    const userExists = await poolInstance.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const newUser = await poolInstance.query(
      'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email',
      [userId, username, email, hashedPassword]
    );

    // Create token
    const token = jwt.sign(
      { id: newUser.rows[0].id, username: newUser.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Error registering user'
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body 
  if (!email || !password) {
    response(401, "", "email or password field cant be empty", res)
    return 
  }

  try {
    const existingUser = await checkRecordExists("users", "email", email) 

    if (existingUser) {
      if (!existingUser.password) {
        response(401, "", "invalid credentials", res)
        return
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      )

      if (passwordMatch) {
        res.cookie("token", generateAccessToken(existingUser.userid))
        res.status(200).json({
          userid: existingUser.userid,
          email: existingUser.email,
          access_token: generateAccessToken(existingUser.userid),
        })
      } else {
        response(401, "", "wrong password", res)
      }
    } else {
      response(401, "", "email not registered", res)
    }
  } catch (error) {
    response(500, "", error, res)
  }
}

const logout = async  (req, res) => {
  try {
    res.clearCookie("token")
    response(200, "", "user logged out successfully", res)
  } catch (error) {
    response(400, "", error, res)
  }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // ... password verification logic ...

        const token = jwt.sign(
            { 
                userId: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Sign in successful',
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role
            },
            token
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

const forgetPassword = async (req, res) => {
  try {
      const { email } = req.body;

      if (!email) {
          return res.status(400).json({ message: 'Email harus ada' });
      }

      // Check if user exists
      const user = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
      );

      if (user.rows.length === 0) {
          return res.status(404).json({ message: 'User dengan email ini tidak ada' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

      // Store reset token in database
      await pool.query(
          `UPDATE users 
           SET reset_token = $1, 
               reset_token_expiry = $2 
           WHERE email = $3`,
          [resetToken, resetTokenExpiry, email]
      );

      
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // === Setup Nodemailer 
      const transporter = nodemailer.createTransport({
          service: 'gmail', 
          auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS  
          }
      });

      // === Compose Email 
      const mailOptions = {
          from: `"RealRate Team" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Password Reset Request',
          html: `
              <p>Hi ${user.rows[0].username || 'User'},</p>
              <p>You requested to reset your password. Click the link below to continue:</p>
              <a href="${resetUrl}">${resetUrl}</a>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn’t request this, you can safely ignore it.</p>
          `
      };

      // === Send Email ===
      await transporter.sendMail(mailOptions);

      res.json({ 
          message: 'Password reset instructions sent to email',
          success: true
      });

  } catch (error) {
      console.error('Forget password error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ 
                message: 'Token and new password are required' 
            });
        }

        // Find user with valid reset token
        const result = await pool.query(
            `SELECT id FROM users 
             WHERE reset_token = $1 
             AND reset_token_expiry > NOW()`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ 
                message: 'Invalid or expired reset token' 
            });
        }

        const userId = result.rows[0].id;

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await pool.query(
            `UPDATE users 
             SET password = $1, 
                 reset_token = NULL, 
                 reset_token_expiry = NULL 
             WHERE id = $2`,
            [hashedPassword, userId]
        );

        res.json({ 
            message: 'Password has been reset successfully' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};

module.exports = {
  register,
  login,
  logout,
  signIn,
  forgetPassword,
  resetPassword,
}
