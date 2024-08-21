const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/dbConnection");

const router = express.Router();

// Use a hardcoded secret key (not recommended for production)
const jwtSecret = "your_secret_key"; // Replace with your actual secret key

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Check if the user has verified their email
    if (!user.is_verified) {
      return res.status(400).json({
        message: "Your account is not verified. Please verify your account.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      status: 200,
      data: {
        jwt: {
          access_token: token,
          token_type: "bearer",
          expires_in: 3600,
        },
      },
    });
  });
});

module.exports = router;
