// Assuming you have the necessary JWT verification middleware
const db = require('../config/db');  // Assuming you have your DB connection setup

// Route to fetch user details
const getDetails = async (req, res) => {
    try {
        // Extract the 'username' from the JWT payload (req.user should have the 'username')
        if (!req.user) {
            return res.status(400).json({ message: "User not found in token." });
        }

        const username  = req.user; // From the decoded token

        // Query the database to get user details using the username
        const query = 'SELECT firstName, lastName, email, username FROM users WHERE username = ?';
        const [results] = await db.execute(query, [username]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Send user details back to the frontend
        res.json(results[0]);  // Send user details (first result)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user details.' });
    }
};

module.exports = { getDetails };
