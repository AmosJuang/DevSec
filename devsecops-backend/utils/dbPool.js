const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'devsecops-db',
    database: process.env.DB_NAME || 'devsecop',
    password: process.env.DB_PASSWORD || 'Amosjuang007!',
    port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Database connection successful');
    release();
});

module.exports = pool;