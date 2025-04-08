const response = require("../response")
const { updateRecord, checkRecordExists } = require("../utils/sqlFunctions")
const pool = require('../utils/dbPool');

const updateUserProfile = async (req, res) => {
  const { userid } = req.user
  const updatedData = req.body

  try {
    const updatedUser = await updateRecord("users", "userid", userid, updatedData)
    response(200, updatedUser, "Profile updated successfully", res)
  } catch (error) {
    response(500, "", error, res)
  }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getUserProfile };
