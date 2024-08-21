const mysql = require("mysql2");
// Create a connection pool to the database
// const pool = mysql.createPool({
//   host: "sql12.freesqldatabase.com", // Corrected to lowercase 'host'
//   user: "sql12726739", // Corrected key 'user'
//   password: "q5dMZkAwCk", // Corrected key 'password'
//   database: "sql12726739", // Corrected key 'database'
//   port: 3306, // Corrected key 'port'
// });

const pool = mysql.createPool({
  host: "sql12.freesqldatabase.com", // Corrected to lowercase 'host'
  user: "sql12727086", // Corrected key 'user'
  password: "ZpJRcCqetw", // Corrected key 'password'
  database: "sql12727086", // Corrected key 'database'
  port: 3306, // Corrected key 'port'
});

// Handle connection errors
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  } else {
    console.log("Database connection established successfully!");
  }

  if (connection) connection.release(); // Release the connection back to the pool
  return;
});

// Export the pool object to be used in other modules
module.exports = pool;
