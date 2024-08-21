// routes/placeImageRoutes.js
const express = require('express');
const db = require('../database/dbConnection');
const router = express.Router();

// Route to add a new image for a place
router.post('/addPlaceImage', (req, res) => {
    const { placeId, imageUrl } = req.body;

    const query = `INSERT INTO place_images (placeId, imageUrl) VALUES (?, ?)`;

    db.execute(query, [placeId, imageUrl], (err, results) => {
        if (err) {
            console.error('Error inserting data: ' + err.stack);
            return res.status(500).json({ message: 'Error inserting data', error: err });
        }
        console.log('Place image inserted successfully with ID: ' + results.insertId);
        res.status(200).json({ message: 'Place image inserted successfully', imageId: results.insertId });
    });
});

// Route to get all images for a place
router.get('/placeImages/:placeId', (req, res) => {
    const placeId = req.params.placeId;

    const query = `SELECT * FROM place_images WHERE placeId = ?`;

    db.query(query, [placeId], (err, results) => {
        if (err) {
            console.error('Error fetching data: ' + err.stack);
            return res.status(500).json({ message: 'Error fetching data', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: `No images found for place with ID ${placeId}` });
        }

        console.log('Place images retrieved successfully');
        res.status(200).json(results);
    });
});

module.exports = router;
