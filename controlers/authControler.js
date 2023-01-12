const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Sign Token
const signToken = (id) => {
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
  const token = signToken(newUser._id);
  //SEND CRAETED USER TO CLIENT
  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      user: newUser,
    },
  });
});

// Loggin-in users --> for existing users
exports.login = catchAsync(async (req, res, next) => {
  //read email and password from body
  // const email = req.body.email;
  // const password = req.body.password;

  // some ES6 destructuring magic to implement the above two lines
  const { email, password } = req.body;

  //check email and password exist

  if (!email || !password) {
    return next(new AppError('Please Provide Email and Password', 400));
  }

  //check if user exist
  const user = await User.findOne({ email }).select('+password');
  const correct = await user.correctPassword(password, user.password);

  //check if password is correct

  if (!user || !correct) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  //If everything is fine issue a JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
