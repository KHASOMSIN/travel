const express = require("express");
const db = require("../database/dbConnection");
const router = express.Router();

// Get user profile details
router.get("/get/profile/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
        SELECT 
            u.fullname AS name,
            u.email,
            p.gender,
            p.dob,
            p.phone_number AS phone,
            p.profile
        FROM 
            users u
        JOIN 
            user_profile p 
        ON 
            u.userId = p.userId
        WHERE 
            u.userId = ?;
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send("User not found");
    }
  });
});

module.exports = router;
