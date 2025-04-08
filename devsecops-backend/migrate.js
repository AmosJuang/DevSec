const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Use environment variables that work for both local and Docker
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'devsecops-db', // Default to Docker service name
    database: 'postgres', // Connect to default DB first
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432
};

// Initial connection to create database
const initialPool = new Pool(dbConfig);

const createDatabase = async () => {
    try {
        await initialPool.query(`
            CREATE DATABASE devsecop
            WITH OWNER = ${process.env.DB_USER || 'postgres'}
            ENCODING = 'UTF8'
            CONNECTION LIMIT = -1;
        `);
        console.log('Database created successfully');
    } catch (error) {
        if (error.code === '42P04') {
            console.log('Database already exists');
        } else {
            console.error('Error creating database:', error);
            throw error;
        }
    } finally {
        await initialPool.end();
    }
};

// Connect to the target database
const pool = new Pool({
    ...dbConfig,
    database: 'devsecop'
});

const createTables = async () => {
    try {
        // Create UUID extension
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);
        console.log('UUID extension enabled');

        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Users table created successfully');

        // Create film table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS film (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                sinopsis TEXT,
                genre VARCHAR(100),
                poster_url TEXT,
                rating DECIMAL(2,1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Film table created successfully');

        // Create reviews table with updated constraints
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                film_id INTEGER REFERENCES film(id) ON DELETE CASCADE,
                rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, film_id)
            );

            -- Create index for faster review lookups
            CREATE INDEX IF NOT EXISTS idx_reviews_film_id ON reviews(film_id);
            CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
            
            -- Create trigger to update film rating
            CREATE OR REPLACE FUNCTION update_film_rating()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE film
                SET rating = (
                    SELECT ROUND(AVG(rating)::numeric, 1)
                    FROM reviews
                    WHERE film_id = NEW.film_id
                )
                WHERE id = NEW.film_id;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Drop trigger if exists
            DROP TRIGGER IF EXISTS update_film_rating_trigger ON reviews;

            -- Create trigger
            CREATE TRIGGER update_film_rating_trigger
            AFTER INSERT OR UPDATE OR DELETE ON reviews
            FOR EACH ROW
            EXECUTE FUNCTION update_film_rating();
        `);
        console.log('Reviews table and triggers created successfully');

        // Create an admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        await pool.query(`
            INSERT INTO users (username, email, password, role)
            VALUES ('admin', 'admin@example.com', $1, 'admin')
            ON CONFLICT (email) DO NOTHING;
        `, [adminPassword]);

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    } finally {
        await pool.end();
    }
};

// Run migrations
(async () => {
    try {
        await createDatabase();
        await createTables();
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
})();