const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

//NAME, EMAIL, PHOTO, PASSWORD, PASSWORD CONFIRM.

//Create Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
    },

    email: {
      type: String,
      required: [true, 'User must have an email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please Provide a valid email'],
    },

    role: {
      type: String,
      enum: ['admin', 'guide', 'lead-guide', 'user'],
      default: 'user',
    },

    photo: String,
    password: {
      type: String,
      required: [true, 'User must have a password'],
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [false, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { versionKey: false, strict: true }
);

// HASHING THE PASSWORD BEFORE STORING IN DB
UserSchema.pre('save', async function (next) {
  // check for password change (creation or modification)
  if (!this.isModified('password')) {
    return next();
  }
  //  hash password (using bcrypt) with cost of 10
  this.password = await bcrypt.hash(this.password, 12);

  //  clear/ delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// VALIDATING PASWWORD PROVIDED
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//CHECK IF USER CHANGED PASSWORD AFTER LOGIN
UserSchema.methods.changedPasswordAfter = async function (JWTimestamp) {
  if (this.passowrdChangedAt) {
    console.log(this.passowrdChangedAt, JWTimestamp);
    const changedTimestamp = parseInt(
      this.passowrdChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passowrdChangedAt, JWTimestamp);

    return JWTimestamp < changedTimestamp;
  }

  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // hash the token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // set token expiry (10 min)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(resetToken);

  return resetToken;
};

//  CREATE MODEL USING SCHEAM

const User = mongoose.model('User', UserSchema);

// Export Module
module.exports = User;
