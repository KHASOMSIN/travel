// get provinces.js
const express = require("express");
const db = require("../database/dbConnection");
const router = express.Router();

// Get all provinces
router.get("/provinces", (req, res) => {
  const query = "SELECT * FROM provinces";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error during provinces retrieval:", err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).send("No provinces found");
    }

    res.status(200).json({
      message: "Provinces retrieved successfully",
      provinces: results,
    });
  });
});

// Get a specific province by ID
router.get("/province/:provinceId", (req, res) => {
  const provinceId = req.params.provinceId;
  const query = "SELECT * FROM provinces WHERE provinceId = ?";

  db.query(query, [provinceId], (err, results) => {
    if (err) {
      console.error("Database error during province retrieval:", err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).send("Province not found");
    }

    res.status(200).json({
      message: "Province retrieved successfully",
      province: results[0],
    });
  });
});

module.exports = router;
