
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../config/db');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const query = 'SELECT * FROM users WHERE username = ?';
    try {
        const [results] = await db.execute(query, [user]);
        const foundUser = results[0];  // Assuming the first result is the user
        if (!foundUser) return res.sendStatus(401);  // Unauthorized

        // Check password
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (!match) {
            console.log("Enter correct password!");
            return res.sendStatus(401);  // Unauthorized
        }

        // Create JWTs
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": [foundUser.role]
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        console.log("decoding access token");
        console.log(jwt.decode(accessToken));
        console.log(foundUser.username);
        console.log(foundUser.role);
        console.log(accessToken);

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2d' }
        );

        // Save refreshToken to the database
        const updateQuery = 'UPDATE users SET refreshToken = ? WHERE username = ?';
        await db.execute(updateQuery, [refreshToken, foundUser.username]);

        // Set the refreshToken as a cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        // Before sending the response
        console.log({ accessToken, role: foundUser.role });
        res.json({ accessToken, role: foundUser.role });

        //res.redirect('/speakerProfile'); -> handling redirection in frontend
    } catch (err) {
        console.error(err);
        res.sendStatus(500);  // Internal server error
    }
}

module.exports = { handleLogin };