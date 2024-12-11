const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleAuthCheck = async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
        // If no token is provided, respond with loggedIn: false
        console.log("no token provided");
        return res.json({ loggedIn: false });
      }

      try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
        // If the token is valid, return loggedIn: true
        console.log(decoded);
        return res.json({ loggedIn: true, user: decoded }); // Optionally, you can also send user data
      } catch (error) {
        // If the token is invalid or expired, respond with loggedIn: false
        return res.json({ loggedIn: false });
      }
  };

  module.exports = { handleAuthCheck }
  