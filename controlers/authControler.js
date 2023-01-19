const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Sign Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
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
    passwordChangedAt: req.body.passwordChangedAt,
  });

  //  SIGN ON A SUCCESSFULLY REGISTERD USER
  let token = undefined;
  token = await signToken(newUser._id);

  console.log(token);
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

exports.protect = catchAsync(async (req, res, next) => {
  //  1> Get JWT and check
  let token = '';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Your are not logged in. Please login to get access', 401)
    );
  }

  // 2> Validate the JWT
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3> Check if the user still exists

  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user with this token does not exist, Please signin/login',
        401
      )
    );
  }
  // 4> Check if user changed password after JwT was issued
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError('User recently changed password, Login again', 401)
    );
  }

  //GRANT AUTHORIZED ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
