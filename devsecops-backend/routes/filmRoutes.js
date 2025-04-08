const express = require('express');
const router = express.Router();
const { 
    getAllFilms, 
    getFilmById, 
    getFilmByTitle,
    addFilm,
    getFilmReviews,
    addReview,
    insertFilm,
    deleteFilm
} = require('../controllers/filmController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Film routes
router.get('/search', getFilmByTitle);
router.get('/', getAllFilms);
router.get('/:id', getFilmById);
//router.post('/', verifyToken, verifyAdmin, upload.single('image'), addFilm);
router.post('/', verifyToken, verifyAdmin,insertFilm);
router.delete('/:id', verifyToken, verifyAdmin, deleteFilm);

// Review routes
router.get('/:id/reviews', getFilmReviews);
router.post('/:id/reviews', verifyToken, addReview);

module.exports = router;
