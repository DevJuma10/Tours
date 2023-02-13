const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');

// GET ALL REVIEWS ENDPOINT

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       reviews,
//     },
//   });
//   next();
// });
exports.getAllReviews = factory.getAll(Review);
// CREATING A REVIEW ENDPOINT
// exports.createReview = catchAsync(async (req, res, next) => {
//   // Nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;

//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     message: 'Created',
//     data: {
//       review: newReview,
//     },
//   });
//   next();
// });

exports.setToursAndUserId = (req, res, next) => {
  // setting tours and users
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};
exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.getReview = factory.getOne(Review);
