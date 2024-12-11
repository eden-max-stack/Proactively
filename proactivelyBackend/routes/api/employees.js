const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Speaker), employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Speaker), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Speaker), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Speaker), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;