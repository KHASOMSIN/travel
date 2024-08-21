const express = require("express");
const db = require("../database/dbConnection"); // Ensure this path is correct
const router = express.Router();

// Route to associate a review with a place
router.post("/addPlaceReview", (req, res) => {
  const { placeId, reviewId } = req.body;

  const query = `INSERT INTO place_review (placeId, reviewId) VALUES (?, ?)`;

  db.execute(query, [placeId, reviewId], (err, results) => {
    if (err) {
      console.error("Error inserting data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error inserting data", error: err });
    }
    console.log("Place review association added successfully");
    res
      .status(200)
      .json({ message: "Place review association added successfully" });
  });
});

// Route to get all reviews for a place
router.get("/placeReviews/:placeId", (req, res) => {
  const placeId = req.params.placeId;

  const query = `SELECT r.* FROM review r INNER JOIN place_review pr ON r.reviewId = pr.reviewId WHERE pr.placeId = ?`;

  db.query(query, [placeId], (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `No reviews found for place with ID ${placeId}` });
    }

    console.log("Place reviews retrieved successfully");
    res.status(200).json(results);
  });
});

module.exports = router;
