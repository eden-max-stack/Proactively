const express = require('express');
const router = express.Router();
const speakerListingsController = require('../../controllers/speakerListingsController');

router.route('/')
    .get(speakerListingsController.getProfiles)

module.exports = router;