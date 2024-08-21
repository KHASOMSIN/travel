// routes/locationRoutes.js
const express = require("express");
const db = require("../database/dbConnection"); // Ensure this path is correct
const router = express.Router();

// Route to insert a new location
router.post("/addLocation", (req, res) => {
  const { provinceId, locationName, latitude, longitude } = req.body;

  // SQL query to insert a new location
  const query = `INSERT INTO location (provinceId, locationName, latitude, longitude) VALUES (?, ?, ?, ?)`;

  // Execute the query
  db.execute(
    query,
    [provinceId, locationName, latitude, longitude],
    (err, results) => {
      if (err) {
        console.error("Error inserting data: " + err.stack);
        return res
          .status(500)
          .json({ message: "Error inserting data", error: err });
      }
      console.log(
        "Location inserted successfully with ID: " + results.insertId
      );
      res
        .status(200)
        .json({
          message: "Location inserted successfully",
          locationId: results.insertId,
        });
    }
  );
});

// Route to get all locations
router.get("/locations", (req, res) => {
  // SQL query to select all locations
  const query = `SELECT * FROM location`;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }
    console.log("Locations retrieved successfully");
    res.status(200).json(results);
  });
});

// Route to get a location by ID
router.get("/locations/:id", (req, res) => {
  const locationId = req.params.id;

  // SQL query to select a location by ID
  const query = `SELECT * FROM location WHERE locationId = ?`;

  // Execute the query
  db.query(query, [locationId], (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `Location with ID ${locationId} not found` });
    }

    console.log("Location retrieved successfully");
    res.status(200).json(results[0]); // Return the first (and only) result
  });
});

module.exports = router;
