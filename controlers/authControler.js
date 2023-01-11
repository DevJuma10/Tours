const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// Sign-up users ---> Create Users
exports.signup = catchAsync(async (req, res, next) => {
  //create user
  const newUser = await User.create(req.body);

  //SEND CRAETED USER TO CLIENT
  res.status(201).json({
    status: 'sucess',
    data: {
      user: newUser,
    },
  });
});
