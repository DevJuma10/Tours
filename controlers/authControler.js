const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// Sign-up users ---> Create Users
exports.signup = catchAsync(async (req, res, next) => {
  //create user

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.confirmPassowrd,
  });

  //  SIGN ON A SUCCESSFULLY REGISTERD USER
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //SEND CRAETED USER TO CLIENT
  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      user: newUser,
    },
  });
});
