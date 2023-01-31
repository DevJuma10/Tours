const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * USER CONTRILER
 */

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }

    return newObj;
  });
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

// exports.updateMe = catchAsync(async (req, res, next) => {
//   // Create an error if user post password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         'This route is not for password update. Please use /updateMyPassword',
//         400
//       )
//     );
//   }
//   // Update user document
//   //fileter out unwanted field names not allowed to be updated
//   const filteredBody = filterObj(req.body, 'name', 'email');
//   const userx = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: userx,
//     },
//   });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  // const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  // const updatedUser = await User.findOneAndUpdate(req.user._id, filteredBody, {
  //   new: true,
  //   runValidators: true,
  // });

  const testUser = await User.findByIdAndUpdate(req.user.id, { name: 'Jux' });

  res.status(200).json({
    status: 'success',
    data: {
      user: testUser,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
