const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); // Add this line


const userSchema = new mongoose.Schema({
  // Fields for local authentication
  username: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
  },
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  dateOfBirth: {
    type: Date,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  profileImage: {
    type: String,
  },

  // Fields for OAuth authentication
  googleId: {
    type: String,
    unique: true,
  },
  // Add other fields for different OAuth providers if needed
  // Add other fields as needed
});
// Apply passportLocalMongoose plugin
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // Specify the field for username (could be email or something else)
});

const User = mongoose.model('User', userSchema);

module.exports = User;
