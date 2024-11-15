const express = require('express');
const passport = require('passport');

exports.googleAuth = passport.authenticate('google',{scope:['email','profile']});
exports.isLoggedIn = (req, res, next) => {
    // Check if the user is authenticated  
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to the next middleware or route handler
    }
    // If not authenticated, redirect to the login page or handle it accordingly
    return res.status(401).redirect('/login'); // Adjust the URL based on your login route
};

exports.failureHandler=(req,res)=>{
    res.send("something went wrong");
};