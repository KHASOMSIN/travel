const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/dbConnection"); // Ensure this path is correct
const router = express.Router();
const saltRounds = 10;

// Change Password
router.post("/change-password", async (req, res) => {
  const { email, currentPassword, newPassword, newPasswordConfirmation } =
    req.body;

  if (!email || !currentPassword || !newPassword || !newPasswordConfirmation) {
    return res.status(400).json({
      message: "All fields are required",
      status: 400,
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).json({
      message: "New passwords do not match",
      status: 400,
    });
  }

  try {
    // Check if the user exists
    const userQuery = "SELECT * FROM users WHERE email = ?";
    db.query(userQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          message: "Database error",
          status: 500,
        });
      }
      if (results.length === 0) {
        return res.status(400).json({
          message: "User does not exist",
          status: 400,
        });
      }

      const user = results[0];

      // Verify the current password
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({
          message: "Current password is incorrect",
          status: 400,
        });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the password
      const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
      db.query(updateQuery, [hashedNewPassword, email], (err, result) => {
        if (err) {
          console.error("Database error during password update:", err);
          return res.status(500).json({
            message: "Database error",
            status: 500,
          });
        }

        res.status(200).json({
          message: "Password changed successfully",
          status: 200,
        });
      });
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
