const express = require('express');
const router = express.Router();
const userDetailsController = require('../../controllers/userDetailsController');

router.route('/')
    .get(userDetailsController.getDetails);

module.exports = router;