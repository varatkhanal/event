const express = require('express');
const router = express.Router();

const roleController = require('../controllers/RoleController');
const authController = require('../controllers/AuthController');
const isLoggedIn = authController.isLoggedIn;

router.get('/all',isLoggedIn,roleController.getAllRoles);
router.post('/create',isLoggedIn,roleController.createRole);


module.exports = router;