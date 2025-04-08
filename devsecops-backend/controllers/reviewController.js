const pool = require('../utils/dbPool');

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

        console.log('Found reviews:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error in getFilmReviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

const addReview = async (req, res) => {
    try {
        const { film_id, rating, comment } = req.body;
        const user_id = req.user.id;

        console.log('Adding review:', { film_id, rating, comment, user_id });

        const result = await pool.query(`
            INSERT INTO reviews (user_id, film_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, film_id)
            DO UPDATE SET 
                rating = $3, 
                comment = $4,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [user_id, film_id, rating, comment]);

        console.log('Review added:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in addReview:', error);
        res.status(500).json({ message: 'Failed to add review' });
    }
};

module.exports = { getFilmReviews, addReview };
