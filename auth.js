const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { User } = prisma;

var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // Check if the user already exists in the database
        let existingUser = await User.findUnique({ where: { googleId: profile.id } });

        if (!existingUser) {
          // If the user doesn't exist, create a new user
          const newUser = await User.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              profileImage: profile.photos[0].value,
              // Add other fields if needed
              roleId:4
            },
          });
          return cb(null, newUser);
        } else {
          // If the user already exists, return the user
          return cb(null, existingUser);
        }
      } catch (error) {
        // Handle any errors
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Assuming the user object has an 'id' property
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findUnique({ where: { id } });
    done(null, user); // Assuming the user object is retrieved from the database
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
