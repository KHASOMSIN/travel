const express = require("express");
const db = require("../database/dbConnection"); // Ensure this path is correct
const router = express.Router();

// Route to insert a new province detail
router.post("/addProvinceDetail", (req, res) => {
  const {
    provinceID,
    description,
    gallery_photos,
    detail_title,
    detail_text,
    reviewId,
    locationId,
  } = req.body;

  const query = `INSERT INTO provinces_detail (provinceID, description, gallery_photos, detail_title, detail_text, reviewId, locationId) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.execute(
    query,
    [
      provinceID,
      description,
      gallery_photos,
      detail_title,
      detail_text,
      reviewId,
      locationId,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting data: " + err.stack);
        return res
          .status(500)
          .json({ message: "Error inserting data", error: err });
      }
      console.log(
        "Province detail inserted successfully with ID: " + results.insertId
      );
      res
        .status(200)
        .json({
          message: "Province detail inserted successfully",
          detailId: results.insertId,
        });
    }
  );
});

// Route to get all province details
router.get("/provinceDetails", (req, res) => {
  const query = `SELECT * FROM provinces_detail`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }
    console.log("Province details retrieved successfully");
    res.status(200).json(results);
  });
});

// Route to get a province detail by ID
router.get("/provinceDetails/:id", (req, res) => {
  const provinceID = req.params.id;

  const query = `SELECT * FROM provinces_detail WHERE provinceID = ?`;

  db.query(query, [provinceID], (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `Province detail with ID ${provinceID} not found` });
    }

    console.log("Province detail retrieved successfully");
    res.status(200).json(results[0]); // Return the first (and only) result
  });
});

module.exports = router;
