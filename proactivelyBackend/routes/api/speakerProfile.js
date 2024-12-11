const express = require('express');
const router = express.Router();
const speakerProfilesController = require('../../controllers/speakerProfilesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.Speaker), speakerProfilesController.createProfile)

module.exports = router;