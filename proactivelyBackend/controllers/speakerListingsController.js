const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Replace with your database instance

// get all speaker profiles
const getProfiles = async (req, res) => {
    const query = `SELECT 
                        users.firstName, 
                        users.lastName, 
                        users.username,
                        users.email, 
                        speaker_profiles.expertise, 
                        speaker_profiles.price_per_session
                    FROM 
                        speaker_profiles
                    INNER JOIN 
                        users ON speaker_profiles.user_id = users.username
                    WHERE 
                        users.firstName IS NOT NULL 
                        AND users.lastName IS NOT NULL 
                        AND users.email IS NOT NULL 
                        AND speaker_profiles.expertise IS NOT NULL
                        AND speaker_profiles.price_per_session IS NOT NULL;`;

    try {
        const [results] = await db.execute(query);
        console.log('Query Results:', results); 
        res.json(results);
    } catch (error) {
        console.error('Database Error:', error); 
        res.status(500).json({ message: 'Error retrieving profiles' });
    }
};

module.exports = { getProfiles } ;