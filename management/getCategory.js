// getCategories.js
const express = require("express");
const db = require("../database/dbConnection");
const router = express.Router();

// Get all categories
router.get("/categories", (req, res) => {
  const query = "SELECT * FROM category";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error during categories retrieval:", err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).send("No categories found");
    }

    res.status(200).json({
      message: "Categories retrieved successfully",
      categories: results,
    });
  });
});

// Get a specific category by ID
router.get("/category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const query = "SELECT * FROM category WHERE categoryId = ?";

  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error("Database error during category retrieval:", err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).send("Category not found");
    }

    res.status(200).json({
      message: "Category retrieved successfully",
      category: results[0],
    });
  });
});

module.exports = router;
