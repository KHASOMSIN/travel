const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/dbConnection"); // Ensure this path is correct
const router = express.Router();

// Helper function to query the database with Promises
const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Reset Password (Set New Password)
router.post("/reset-password", async (req, res) => {
  const { email, otp, password, passwordToken } = req.body;

  if (!email || !otp || !password || !passwordToken) {
    return res.status(400).json({
      message: "All fields are required",
      status: 400,
    });
  }

  try {
    // Verify OTP and password token
    const query =
      "SELECT * FROM users WHERE email = ? AND otp = ? AND password_token = ? AND otp_expires > NOW()";
    const results = await queryDatabase(query, [email, otp, passwordToken]);

    if (results.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired OTP/password token",
        status: 400,
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password and clear OTP and password token
    const updateQuery =
      "UPDATE users SET password = ?, otp = NULL, otp_expires = NULL, password_token = NULL WHERE email = ?";
    await queryDatabase(updateQuery, [hashedPassword, email]);

    res.status(200).json({
      message: "Password reset successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      message: "Server error",
      status: 500,
    });
  }
});

module.exports = router;
