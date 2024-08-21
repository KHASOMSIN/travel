const express = require("express");
const db = require("../database/dbConnection");
const router = express.Router();
const cloudinary = require("cloudinary").v2; // Use v2 directly

// Configure Cloudinary
cloudinary.config({
  cloud_name: "doaxvtpre",
  api_key: "124993626555596",
  api_secret: "your_api_secret", // It's good practice to store secrets in environment variables
  secure: true,
});

// Create or update user profile
router.post("/insert/profile", (req, res) => {
  const { userId, gender, dob, profile, phone_number } = req.body;

  // Input validation
  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  // Handle image upload if profile_image is provided
  if (profile) {
    cloudinary.uploader.upload(profile, (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).send("Failed to upload image");
      }

      const imageUrl = result.secure_url; // Get the secure URL from Cloudinary

      // Proceed to create or update the profile
      upsertUserProfile(userId, gender, dob, imageUrl, phone_number, res);
    });
  } else {
    // If no image provided, proceed with other data
    upsertUserProfile(userId, gender, dob, null, phone_number, res);
  }
});

// Function to handle profile upsert (update or insert)
function upsertUserProfile(userId, gender, dob, profile, phone_number, res) {
  // Query to check if profile already exists
  const checkProfileQuery = "SELECT * FROM user_profile WHERE userId = ?";

  db.query(checkProfileQuery, [userId], (err, results) => {
    if (err) {
      console.error("Database error during profile check:", err);
      return res.status(500).send("Database error");
    }

    if (results.length > 0) {
      // Profile exists, update it
      const updateProfileQuery = `
        UPDATE user_profile
        SET gender = ?, dob = ?, profile = ?, phone_number = ?
        WHERE userId = ?
      `;
      db.query(
        updateProfileQuery,
        [
          gender,
          dob,
          profile || results[0].profile,
          phone_number || results[0].phone_number,
          userId,
        ],
        (err) => {
          if (err) {
            console.error("Database error during profile update:", err);
            return res.status(500).send("Database error");
          }
          return res.status(200).send("Profile updated successfully");
        }
      );
    } else {
      // Profile does not exist, create it
      const createProfileQuery = `
        INSERT INTO user_profile (userId, gender, dob, profile, phone_number)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(
        createProfileQuery,
        [userId, gender, dob, profile, phone_number],
        (err) => {
          if (err) {
            console.error("Database error during profile creation:", err);
            return res.status(500).send("Database error");
          }
          return res.status(201).send("Profile created successfully");
        }
      );
    }
  });
}

module.exports = router;
