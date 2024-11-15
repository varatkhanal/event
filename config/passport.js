// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Define the verification function separately
const verifyCallback = async (req, username, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: username } });
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }
    // Validate password (you may need to implement this logic)
    // For example:
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
    }
    // Assuming the user is authenticated, you can set the user ID in the session
    req.session.userId = user.id;
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

// Use the verification function in LocalStrategy
passport.use(new LocalStrategy({ passReqToCallback: true }, verifyCallback));

passport.serializeUser((user, done) => {
  done(null, user.id); // Assuming the user object has an 'id' property
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user); // Assuming the user object is retrieved from the database
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
