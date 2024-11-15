const express = require('express');
const router = express.Router();

const bookingController=require('../controllers/BookingController');
const authController=require('../controllers/AuthController');
const isLoggedIn = authController.isLoggedIn;

//get events
router.get('/all',isLoggedIn,bookingController.getAllBooking);
router.post('/create',isLoggedIn,bookingController.createBooking);
//router.put('/update',bookingController.updateBooking);

module.exports = router;