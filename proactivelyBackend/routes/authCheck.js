const express = require('express');
const router = express.Router();
const authCheckController = require('../controllers/authCheckController');

router.get('/', authCheckController.handleAuthCheck);

module.exports = router;