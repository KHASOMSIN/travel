const express = require("express");
const db = require("../database/dbConnection");
const router = express.Router();

// Search places by name
router.get("/search", (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({
      message: "Search query is required",
      status: 400,
      data: null,
    });
  }

  const sqlQuery = `
        SELECT * FROM place
        WHERE placeName LIKE ?
    `;

  db.query(sqlQuery, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({
        message: "Server error",
        status: 500,
        data: null,
      });
    }

    console.log(`Executing query: ${sqlQuery} with value: ${searchQuery}`);

    res.status(200).json({
      message: "Places retrieved successfully",
      status: 200,
      data: results,
    });
  });
});

// Search provinces by name
router.get("/provinces/search", (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({
      message: "Search query is required",
      status: 400,
      data: null,
    });
  }

  const sqlQuery = `
        SELECT * FROM provinces 
        WHERE provinceName LIKE ?
    `;

  db.query(sqlQuery, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({
        message: "Server error",
        status: 500,
        data: null,
      });
    }

    res.status(200).json({
      message: "Provinces retrieved successfully",
      status: 200,
      data: results,
    });
  });
});

module.exports = router;
