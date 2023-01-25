const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// Sign Token
const signToken = (id) => {
  const tkn = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return tkn;
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

  const token = await signToken(newUser._id);

  console.log(token);
  //SEND CRAETED USER TO CLIENT
  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      user: newUser,
    },
  });

  next();
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

  next();
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
  if (!currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError('User recently changed password, Login again', 401)
    );
  }

  //GRANT AUTHORIZED ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin','lead-guide']
    //role=user

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You don not have permissions to perfom this role', 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1.) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  // 2.) Return Error if no user
  if (!user) {
    next(new AppError('No user matching that email address', 404));
  }

  // 3.) Generate a temporary random Token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false }); //validateBeforeSave --> devalidates all fields marked as required in the schema

  // 4.) Send it ti user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf your didn't forget password, please ignore this email!`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });

    next();
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the Email, try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
