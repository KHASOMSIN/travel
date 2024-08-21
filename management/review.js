const express = require("express");
const db = require("../database/dbConnection");
const router = express.Router();

// Route to add a new review for a province or place
router.post("/addReview", (req, res) => {
  const { userId, ratingStar, reviewDetail, reviewDate, provinceId, placeId } =
    req.body;

  // Validate required fields
  if (!userId || !ratingStar || !reviewDetail) {
    return res.status(400).json({
      message: "Missing required fields: userId, ratingStar, or reviewDetail.",
    });
  }

  // Validate ratingStar range
  if (ratingStar < 1 || ratingStar > 5) {
    return res
      .status(400)
      .json({ message: "ratingStar must be between 1 and 5." });
  }

  // Ensure either provinceId or placeId is provided, but not both
  if ((provinceId && placeId) || (!provinceId && !placeId)) {
    return res.status(400).json({
      message: "Please provide either provinceId or placeId, but not both.",
    });
  }

  // Set default reviewDate if not provided
  const reviewDateToUse = reviewDate || new Date();

  const query = `INSERT INTO review (userId, ratingStar, reviewDetail, reviewDate, provinceId, placeId)
                   VALUES (?, ?, ?, ?, ?, ?)`;

  db.execute(
    query,
    [
      userId,
      ratingStar,
      reviewDetail,
      reviewDateToUse,
      provinceId || null,
      placeId || null,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting data: " + err.stack);
        return res
          .status(500)
          .json({ message: "Error inserting data", error: err });
      }
      console.log("Review inserted successfully with ID: " + results.insertId);
      res.status(200).json({
        message: "Review inserted successfully",
        reviewId: results.insertId,
      });
    }
  );
});

// Route to get all reviews for a province
router.get("/reviews/provinces/:provinceId", (req, res) => {
  const provinceId = req.params.provinceId;

  if (!provinceId) {
    return res.status(400).json({ message: "provinceId is required." });
  }

  const query = `SELECT * FROM review WHERE provinceId = ?`;

  db.query(query, [provinceId], (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: `No reviews found for province with ID ${provinceId}`,
      });
    }

    console.log("Province reviews retrieved successfully");
    res.status(200).json(results);
  });
});

// Route to get all reviews for a place
router.get("/reviews/places/:placeId", (req, res) => {
  const placeId = req.params.placeId;

  if (!placeId) {
    return res.status(400).json({ message: "placeId is required." });
  }

  const query = `SELECT * FROM review WHERE placeId = ?`;

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
