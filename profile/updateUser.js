const express = require("express");
const pool = require("../database/dbUpdate"); // Import the promise-based pool
const router = express.Router();

router.put("/update/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { fullname, email, gender, dob, phone_number, profile } = req.body;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start a transaction

    // Check if email already exists
    const [existingEmailRows] = await connection.query(
      "SELECT userId FROM users WHERE email = ? AND userId != ?",
      [email, userId]
    );

    if (existingEmailRows.length > 0) {
      return res.status(400).send("Email is already in use");
    }

    // Update the `users` table
    await connection.query(
      "UPDATE users SET fullname = ?, email = ? WHERE userId = ?",
      [fullname, email, userId]
    );

    // Update the `user_profiles` table
    await connection.query(
      "UPDATE user_profile SET gender = ?, dob = ?, phone_number = ?, profile = ? WHERE userId = ?",
      [gender, dob, phone_number, profile, userId]
    );

    await connection.commit(); // Commit the transaction
    res.status(200).send("User profile updated successfully");
  } catch (err) {
    console.error("Database error during update:", err);
    if (connection) {
      await connection.rollback(); // Rollback the transaction on error
    }
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).send("Duplicate entry error");
    } else {
      res.status(500).send("Database error");
    }
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});

module.exports = router;
