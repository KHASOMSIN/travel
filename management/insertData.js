const express = require("express");
const db = require("../database/dbConnection"); // Ensure this path is correct
const router = express.Router();

// Route to insert data into the 'category' table
router.post("/category", (req, res) => {
  const { imageIcon, category_title } = req.body;

  if (!imageIcon || !category_title) {
    return res
      .status(400)
      .json({ message: "Please provide both imageIcon and category_title" });
  }

  const insertCategory = `INSERT INTO category (imageIcon, category_title) VALUES (?, ?)`;
  db.query(insertCategory, [imageIcon, category_title], (err, results) => {
    if (err) {
      console.error("Error inserting category:", err.message);
      return res
        .status(500)
        .json({ message: "Failed to insert category", error: err.message });
    }
    res
      .status(201)
      .json({ message: "Category inserted", categoryId: results.insertId });
  });
});

// Route to insert data into the 'provinces' table
router.post("/provinces", (req, res) => {
  const { provinceImage, provinceName } = req.body;

  if (!provinceImage || !provinceName) {
    return res
      .status(400)
      .json({ message: "Please provide both provinceImage and provinceName" });
  }

  const insertProvince = `INSERT INTO provinces (provinceImage, provinceName) VALUES (?, ?)`;
  db.query(insertProvince, [provinceImage, provinceName], (err, results) => {
    if (err) {
      console.error("Error inserting province:", err.message);
      return res
        .status(500)
        .json({ message: "Failed to insert province", error: err.message });
    }
    res
      .status(201)
      .json({ message: "Province inserted", provinceId: results.insertId });
  });
});

// Route to insert data into the 'location' table
router.post("/location", (req, res) => {
  const { provinceId, locationName, latitude, longitude } = req.body;

  if (!provinceId || !locationName || !latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const insertLocation = `INSERT INTO location (provinceId, locationName, latitude, longitude) VALUES (?, ?, ?, ?)`;
  db.query(
    insertLocation,
    [provinceId, locationName, latitude, longitude],
    (err, results) => {
      if (err) {
        console.error("Error inserting location:", err.message);
        return res
          .status(500)
          .json({ message: "Failed to insert location", error: err.message });
      }
      res
        .status(201)
        .json({ message: "Location inserted", locationId: results.insertId });
    }
  );
});

module.exports = router;
