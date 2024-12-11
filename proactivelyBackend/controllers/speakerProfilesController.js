const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/verifyJWT'); // Middleware to authenticate
const db = require('../config/db'); // Replace with your database instance

// Create or Update Speaker Profile
const createProfile = async (req, res) => {
    const { expertise, price_per_session } = req.body;
    const userId = req.user;
    console.log("userId is");
    console.log(userId);

    try {
        const result = await db.query(
            `INSERT INTO speaker_profiles (user_id, expertise, price_per_session)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE expertise = ?, price_per_session = ?`,
            [userId, expertise, price_per_session, expertise, price_per_session]
        );
        res.status(200).json({ message: 'Profile saved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving profile' });
    }
};

module.exports = {
    createProfile
};
