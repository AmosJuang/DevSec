const filmSchema = `
CREATE TABLE IF NOT EXISTS film (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sinopsis TEXT,
    genre VARCHAR(100),
    image_url TEXT,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_title CHECK (LENGTH(title) >= 1),
    CONSTRAINT valid_genre CHECK (LENGTH(genre) >= 1)
);`

module.exports = filmSchema;