const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { getUserProfile } = require('../controllers/userController');

router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
