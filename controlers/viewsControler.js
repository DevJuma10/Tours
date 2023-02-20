const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1. Get Tour data from collection
  const tours = await Tour.find();

  //2 Build Template

  //render template using data form 1

  res.status(200).render('overview', {
    title: 'Home',
    tours,
  });
});

// exports.getTour = (req, res) => {
//   res.status(200).render('tour', {
//     title: 'The Forest Hiker',
//   });
// };

exports.getTour = catchAsync(async (req, res, next) => {
  // get details (including reviews & gides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // Build Template

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
  next();
});
