const express = require('express');
const router = express.Router();
const eventsController=require('../controllers/EventsController');
const authController=require('../controllers/AuthController');

//get events
router.get('/all',authController.isLoggedIn, eventsController.getAllEvents);
router.post('/create',authController.isLoggedIn,eventsController.createEvent);

module.exports = router;