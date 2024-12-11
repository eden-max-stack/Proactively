const express = require('express');
const router = express.Router();
const bookingsController = require('../../controllers/bookingsController');

router.route('/')
    .get(bookingsController.getBookings)
    .post(bookingsController.bookSession)

module.exports = router;