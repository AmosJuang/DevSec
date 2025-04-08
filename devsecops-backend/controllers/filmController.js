const { getAllRecords, getRecordById, insertRecord } = require('../utils/sqlFunctions')
const response = require('../response')
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Added fs module for file operations
const poolInstance = require('../utils/dbPool'); // Assuming poolInstance is defined in dbPool.js
const pool = require('../utils/dbPool');
const { v4: uuidv4 } = require('uuid');
const upload = multer({
  dest: path.join(__dirname, '../uploads/'), 
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getFilmByTitle = async (req, res) => {
  try {
    const { title } = req.query; // Changed from req.params to req.query
    console.log('Searching for title:', title);

    const result = await pool.query(
      `SELECT id, title, sinopsis, genre, rating, poster_url, created_at, updated_at 
       FROM film 
       WHERE LOWER(title) LIKE LOWER($1)`,
      [`%${title}%`]
    );

    // Transform the results to include full URLs
    const films = result.rows.map(film => ({
      ...film,
      poster_url: film.poster_url ? `${film.poster_url}` : null
    }));

    console.log('Search results:', films.length);
    res.json(films);
  } catch (error) {
    console.error('Error searching films:', error);
    res.status(500).json({ message: 'Error searching films' });
  }
};

const getFilmById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching film with ID:', id);

    // Validate ID
    const filmId = parseInt(id);
    if (isNaN(filmId)) {
      return res.status(400).json({
        message: 'Invalid film ID format'
      });
    }

    const result = await pool.query(`
      SELECT id, title, sinopsis, genre, rating, poster_url, 
             created_at, updated_at
      FROM film 
      WHERE id = $1
    `, [filmId]);

    if (result.rows.length === 0) {
      console.log(`Film with ID ${filmId} not found`);
      return res.status(404).json({ 
        message: `Film with ID ${filmId} not found` 
      });
    }

    // Transform the film data
    const film = {
      ...result.rows[0],
      poster_url: result.rows[0].poster_url 
        ? `${result.rows[0].poster_url}` 
        : null,
      rating: parseFloat(result.rows[0].rating) || 0
    };

    console.log('Film found:', film);
    res.json(film);
  } catch (error) {
    console.error('Error in getFilmById:', error);
    res.status(500).json({ 
      message: 'Failed to fetch film details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getAllFilms = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT id, title, sinopsis, genre, rating, poster_url, 
               created_at, updated_at
        FROM film
        ORDER BY created_at DESC
    `);

    // Transform the results to include full URLs for poster images
    const films = result.rows.map(film => ({
      ...film,
      poster_url: film.poster_url ? `${film.poster_url}` : null
    }));

    console.log('Films found:', films.length);
    res.json(films);
  } catch (error) {
    console.error('Error in getAllFilms:', error);
    res.status(500).json({ message: 'Failed to fetch films' });
  }
};

const insertFilm = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return response(400, null, 'Error uploading file', res);
      }

      const { title, sinopsis, genre } = req.body;
      const imagePath = req.file?.path;

      if (!imagePath) {
        return response(400, null, 'Image file is required', res);
      }

      const uploadResult = await cloudinary.uploader.upload(imagePath, {
        folder: 'aksesin',
      });

      const newFilm = {
        id: Math.floor(Math.random() * 1000000), 
        title,
        sinopsis,
        genre,
        poster_url: uploadResult.secure_url,
      };

      const insertedFilm = await insertRecord('film', newFilm);
      response(201, insertedFilm, 'Film inserted successfully', res);
    });
  } catch (error) {
    console.error('Error inserting film:', error);
    response(500, null, 'Error inserting film', res);
  }
}

const addFilm = async (req, res) => {
  try {
    const { title, sinopsis, genre, rating } = req.body;
    const poster_url = req.file ? req.file.path : null;

    // Validate required fields
    if (!title || !sinopsis || !genre) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse rating to decimal or set default
    const initialRating = rating ? parseFloat(rating) : 0;

    const result = await pool.query(
      `INSERT INTO film (title, sinopsis, genre, poster_url, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, sinopsis, genre, poster_url, initialRating]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding film:', error);
    res.status(500).json({ message: 'Failed to add film' });
  }
};

const getFilmReviews = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching reviews for film:', id);

    const result = await pool.query(`
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.film_id = $1
      ORDER BY r.created_at DESC
    `, [id]);

    console.log('Found reviews:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    console.log('Adding review:', { film_id: id, rating, comment, user_id: userId });

    const result = await pool.query(`
      INSERT INTO reviews (user_id, film_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [userId, id, rating, comment]);

    console.log('Review added:', result.rows[0]);

    // Update film's average rating
    await pool.query(`
      UPDATE film 
      SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews 
        WHERE film_id = $1
      )
      WHERE id = $1
    `, [id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
};

const deleteFilm = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete film:', id);

    // First check if film exists
    const filmExists = await pool.query(
      'SELECT poster_url FROM film WHERE id = $1',
      [id]
    );

    if (filmExists.rows.length === 0) {
      return res.status(404).json({ message: 'Film not found' });
    }

    // Delete associated reviews first
    await pool.query(
      'DELETE FROM reviews WHERE film_id = $1',
      [id]
    );

    // Then delete the film
    const result = await pool.query(
      'DELETE FROM film WHERE id = $1 RETURNING *',
      [id]
    );

    // Delete the poster file if it exists
    if (result.rows[0].poster_url) {
      const filePath = path.join(__dirname, '..', result.rows[0].poster_url);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting poster file:', err);
      });
    }

    res.json({ message: 'Film deleted successfully' });
  } catch (error) {
    console.error('Error deleting film:', error);
    res.status(500).json({ message: 'Failed to delete film' });
  }
};

module.exports = {
  getFilmById,
  getFilmByTitle,
  getAllFilms,
  insertFilm,
  addFilm,
  getFilmReviews,
  addReview,
  deleteFilm,
}