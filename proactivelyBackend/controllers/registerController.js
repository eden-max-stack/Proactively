const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const handleNewUser = async (req, res) => {
    console.log('Request Body:', req.body);
    const { user, pwd, fName, lName, role, emailid } = req.body;
    if (!user || !pwd || !fName || !lName || !role || !emailid) return res.status(400).json({ 'message': 'All fields are to be filled.' });
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [user]);
        if (rows.length > 0) {
            return res.status(409).json({ 'message': 'Username already exists.' }); // Conflict
        }

        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Insert the new user into the database
        const result = await db.execute(
            'INSERT INTO users (username, password, firstName, lastName, role, email) VALUES (?, ?, ?, ?, ?, ?)', 
            [user, hashedPwd, fName, lName, role, emailid]
        );

        console.log('User created with ID:', result[0].insertId);  // Log the ID of the newly created user
        res.status(201).json({ 'success': `New user ${user} created!` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser } 