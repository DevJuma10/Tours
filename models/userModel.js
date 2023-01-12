const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//NAME, EMAIL, PHOTO, PASSWORD, PASSWORD CONFIRM.

//Create Schema
const userSchema = new mongoose.Schema(
  {
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
      required: [, 'User must have a password'],
      minlength: 8,
    },

    passwordConfirm: {
      type: String,
      required: [false, 'User should confirm password'],
      validate: {
        // on save or on create check validation
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords did not match',
      },
    },
  },
  { versionKey: false }
);

userSchema.pre('save', async function (next) {
  // check for password change (creation or modification)
  if (!this.isModified('password')) {
    return next();
  } else {
    //  hash password (using bcrypt) with cost of 10
    this.password = await bcrypt.hash(this.password, 12);

    //  clear/ delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  }
});

//  CREATE MODEL USING SCHEAM

const User = mongoose.model('User', userSchema);

// Export Module
module.exports = User;
