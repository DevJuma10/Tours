const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

  createSendToken(newUser, 201, res);

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
  createSendToken(user, 200, res);

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

  // 4.) Send it to user's email
  // try {
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf your didn't forget password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Ger user based on issued token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // Set new password (only if token has not expired)

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // Update changed password property
  // Log in the user
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user form the collection
  const user = await User.findById(req.user.id).select('+password');

  // Vaidate the password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // if Valid, update the password
  user.password = req.body.passwordConfirm;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // Log the user in
  createSendToken(user, 200, res);
});
