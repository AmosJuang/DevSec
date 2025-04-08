const jwt = require('jsonwebtoken');
const pool = require('../utils/dbPool');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Authentication required' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log

        const result = await pool.query(
            'SELECT id, email, role FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (!result.rows[0]) {
            return res.status(401).json({ 
                message: 'User not found' 
            });
        }

        req.user = result.rows[0];
        console.log('User set in request:', req.user); // Debug log
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ 
            message: 'Invalid or expired token' 
        });
    }
};

const verifyAdmin = (req, res, next) => {
    console.log('Verifying admin. User:', req.user); // Debug log
    
    if (!req.user) {
        return res.status(401).json({ 
            message: 'Authentication required' 
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: 'Admin access required' 
        });
    }

    next();
};

module.exports = { verifyToken, verifyAdmin };