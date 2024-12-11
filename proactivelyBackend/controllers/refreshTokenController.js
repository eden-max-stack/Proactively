// refreshController.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');  // Import the db connection

const handleRefreshToken = (req, res) => {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) return res.sendStatus(401); // Unauthorized

    // Query the database to find the user with the refresh token
    const query = 'SELECT * FROM users WHERE refreshToken = ?';
    console.log('Attempting to verify refresh token in database...');
db.execute(query, [refreshToken], (err, results) => {
    console.log('Database query completed.');
    if (err) {
        console.error('Error with database query:', err);
        return res.sendStatus(500); // Internal server error
    }

    const foundUser = results[0];
    if (!foundUser) return res.sendStatus(403); // Forbidden

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden
        const accessToken = jwt.sign(
            { 
                "User": {
                    "username": foundUser.username,
                    "roles": foundUser.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        console.log(foundUser.username);
        console.log(foundUser.role);

        res.json({ accessToken });
    });
});
};

module.exports = { handleRefreshToken };
