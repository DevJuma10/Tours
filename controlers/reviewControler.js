const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// GET ALL REVIEWS ENDPOINT

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
  next();
});

// CREATING A REVIEW ENDPOINT
exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Created',
    data: {
      review: newReview,
    },
  });
  next();
});
