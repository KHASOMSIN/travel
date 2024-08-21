const mysql = require("mysql2");

// Create a connection pool to the database
const pool = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12726739",
  password: "q5dMZkAwCk",
  database: "sql12726739",
  port: 3306,
});

// Create a promise-based wrapper around the pool
const promisePool = pool.promise();

// Handle connection errors
promisePool
  .getConnection()
  .then((connection) => {
    console.log("Database connection established successfully!");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  });

// Export the promise-based pool object to be used in other modules
module.exports = promisePool;
