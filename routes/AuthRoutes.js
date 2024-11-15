const express = require('express');
const authController = require('../controllers/AuthController');
const passport = require('passport');
const router = express.Router();
require("../auth");

router.get('/google',authController.googleAuth);

router.get('/google/callback',passport.authenticate('google',{
    failureRedirect:'/login',
    successRedirect:'/events/all'
}));

router.get('/google/failure',authController.failureHandler);

module.exports = router;