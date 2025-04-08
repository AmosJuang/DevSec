const reviewSchema =`
CREATE TABLE IF NOT EXISTS review (
    review_id VARCHAR(50) PRIMARY KEY,
    film_id VARCHAR(50) NOT NULL, 
    user_id VARCHAR(50) NOT NULL,
    comment TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (film_id) REFERENCES film(id) ON DELETE CASCADE, 
    FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE
);`

module.exports = reviewSchema