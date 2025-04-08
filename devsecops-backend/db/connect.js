const { Pool } = require("pg");
const config = require("./config");

// Create a new pool instance
const pool = new Pool(config);

pool.on("connect", () => {
  console.log("Connected to database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
