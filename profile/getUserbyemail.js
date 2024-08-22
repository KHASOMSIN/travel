const express = require("express");
const db = require("../database/dbConnection"); // Ensure this points to your database connection
const router = express.Router();

// Get user's email and fullname by email
router.get("/get/email/:email", (req, res) => {
  const email = req.params.email;

  const query = `
    SELECT 
        fullname AS name,
        email,
        userId
    FROM 
        users
    WHERE 
        email = ?;
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

module.exports = router;
