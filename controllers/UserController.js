const bcrypt = require('bcrypt');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Register a new user
const registerUser = async (req, res) => {
  try {
    const {email, password, firstName,lastName, gender, dateOfBirth, phoneNumber, address, profileImage,roleId,} = req.body;
    let isAdmin=false;
    if(roleId==1)
      isAdmin=true;
    const {street, city, state, zipCode, country} = address;
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        isAdmin,
        roleId,
        phoneNumber,
        address:{
          create:{
            street,
            city,
            state,
            zipCode,
            country,
          }
        },

        profileImage,
      },
    });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      // You can handle failure, redirect, or display an error message here
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Authentication succeeded, log in the user
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      // Now you can access the session object and initialize it
      req.session.userId = user.id; // Assuming user.id is the user's ID in your User model
      // Redirect to the profile page upon successful login
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming you have stored the user's ID in the session
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming you have stored the user's ID in the session
    const { username, email, newPassword, name, gender, dateOfBirth, phoneNumber, address, profileImage } = req.body;
    // Update user profile in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        email,
        password: newPassword ? await bcrypt.hash(newPassword, 10) : undefined,
        name,
        gender,
        dateOfBirth,
        phoneNumber,
        address,
        profileImage,
      },
    });
    res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Logout user
const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle error
      console.error(err);
      return res.status(500).json({ error: 'Failed to log out user' });
    }
    // User logged out successfully
    res.status(200).json({ message: 'User logged out successfully' });
  });
  req.session.destroy(); // Destroy the session
  res.status(200).json({ message: 'User logged out successfully' });
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser };