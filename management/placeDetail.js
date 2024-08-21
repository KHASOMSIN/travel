const express = require("express");
const db = require("../database/dbConnection"); // Ensure this path is correct
const router = express.Router();

// Route to add a new place
router.post("/addPlace", (req, res) => {
  const {
    placeName,
    locationId,
    provinceId,
    description,
    detailTitle,
    detailText,
    reviewId,
    categoryId,
    galleryPhotos,
  } = req.body;

  const query = `INSERT INTO place (placeName, locationId, provinceId, description, detailTitle, detailText, reviewId, categoryId, galleryPhotos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.execute(
    query,
    [
      placeName,
      locationId,
      provinceId,
      description,
      detailTitle,
      detailText,
      reviewId,
      categoryId,
      galleryPhotos,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting data: " + err.stack);
        return res
          .status(500)
          .json({ message: "Error inserting data", error: err });
      }
      console.log("Place inserted successfully with ID: " + results.insertId);
      res
        .status(200)
        .json({
          message: "Place inserted successfully",
          placeId: results.insertId,
        });
    }
  );
});

// Route to get all places
router.get("/places", (req, res) => {
  const query = `SELECT * FROM place`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }
    console.log("Places retrieved successfully");
    res.status(200).json(results);
  });
});

// Route to get a place by ID
router.get("/places/:id", (req, res) => {
  const placeId = req.params.id;

  const query = `SELECT * FROM place WHERE placeId = ?`;

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
        .json({ message: `Place with ID ${placeId} not found` });
    }

    console.log("Place retrieved successfully");
    res.status(200).json(results[0]);
  });
});

module.exports = router;
