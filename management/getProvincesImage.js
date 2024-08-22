const express = require("express");
const db = require("../database/dbConnection");
const router = express.Router();

router.get("/provincesImage/:provinceId", (req, res) => {
  const provinceId = req.params.provinceId;

  const query = `SELECT * FROM provinces_images WHERE provinceId = ?`;
  db.query(query, [provinceId], (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({
          message: `No images found for province with ID ${provinceId}`,
        });
    }

    res.status(200).json(results);
  });
});

module.exports = router; // Export the router
