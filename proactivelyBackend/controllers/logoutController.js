const db = require('../config/db'); // Assuming your DB connection is in this file

const handleLogout = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content if no jwt cookie

    const refreshToken = cookies.jwt;

    try {
        // Find the user with the matching refresh token in the database
        const [results] = await db.execute('SELECT * FROM users WHERE refreshToken = ?', [refreshToken]);
        const foundUser = results[0]; // Assuming the first result is the user

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            console.log("user not found.");
            return res.sendStatus(204); // Refresh token not found in DB, clear the cookie and return
        }

        // Update the refreshToken to null (or '' depending on your preference) for the user in DB
        await db.execute('UPDATE users SET refreshToken = NULL WHERE refreshToken = ?', [refreshToken]);
        console.log("refresh token was removed from db.");

        // Clear the refresh token cookie from the clients
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        console.log("cookie cleared !");

        return res.sendStatus(204); // Successfully logged out
    } catch (err) {
        console.error(err);
        return res.sendStatus(500); // Internal server error
    }
};

module.exports = { handleLogout };
