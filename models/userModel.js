const mongoose = require('mongoose');
const validator = require('validator');

//NAME, EMAIL, PHOTO, PASSWORD, PASSWORD CONFIRM.

//Create Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User Must Have Name'],
  },

  email: {
    type: String,
    required: [true, 'User must have a valid email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Pease Provide a valid email'],
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 8,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'User should confirm password'],
  },
});

//  CREATE MODEL USING SCHEAM

const User = mongoose.model('User', userSchema);

// Export Module
module.exports = User;
