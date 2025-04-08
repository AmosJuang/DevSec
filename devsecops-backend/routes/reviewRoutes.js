const express = require('express');
const router = express.Router();
const { getFilmReviews, addReview } = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Get reviews for a specific film
router.get('/films/:id/reviews', getFilmReviews);

// Add a new review (requires authentication)
router.post('/', verifyToken, addReview);

module.exports = router;
