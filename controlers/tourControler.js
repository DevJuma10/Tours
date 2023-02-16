/**
 * TOUR CONTROLERS
 */
// const fs = require('fs');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
//READ DATA FILE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// //  CUSTOM MIDDLEWARE TO VALIDATE ID
// exports.checkID = (req, res, next, val) => {
//   console.log(`ID is ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

/**
 * CUSTOM MIDDLEWARE TO CHECKBODY
CHECK IF BOBY CONTAINS NAME AND PRICE
IF NOT SEND BACK 404 (BAD REQUES)
ADD IT TO THE POST HANDLER
 */

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || req.body.price) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };

//GET ALL TOURS
// const excludedFields = ['page', 'limit', 'sort', 'fields'];
// excludedFields.forEach((el) => delete queryObj[el]);

// // ADVANCED FILTERING
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
// // console.log(JSON.parse(querySt

//##############################################################################################
//    GET ALL TOURS
// ######################

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // try {
//   //   // EXECUTE QUERY

//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;

//   // const query = Tour.find()
//   //   .where('duration')
//   //   .equals(4)
//   //   .where('difficulty')
//   //   .equals('easy')

//   //SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }
// });

exports.getAllTours = factory.getAll(Tour);
//###################################################################################################
//GET TOUR
// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   if (!tour) {
//     return next(new AppError('No Tour Found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'sucesss',
//     data: {
//       tour,
//     },
//   });
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

//CREATE TOUR

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.createTour = factory.createOne(Tour);

//UPDATE TOUR
// exports.updateTour = catchAsync(async (req, res, next) => {
//   // try {
//   //check for item to be updated
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('No Tour Found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'Success',
//     data: {
//       tour,
//     },
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }
// });

exports.updateTour = factory.updateOne(Tour);

//##############################################################################################################################
//DELETE TOUR
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No Tour Found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'Success',
//     data: tour,
//   });
// });

exports.deleteTour = factory.deleteOne(Tour);

//##############################################################################################################################

//  AGGREGARION PIPELINE FOR TOUR STATISTICS
exports.getToursStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    // MATCH ITEMS
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    // GROUP ITEMS
    {
      $group: {
        // _id: null,
        _id: { $toUpper: '$difficulty' },
        // _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },

    //  SORT ITEMS IN ASCENDING ORDER of average price
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

//  AGGREGATION PIPELINE FOR MONTHLY PLAN

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    // REPRODUCE A SINGLE DOCUMENT IN THE CASE START DATES ARE MORE THAN ONE
    {
      $unwind: '$startDates',
    },

    //MATCH YEAR
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    //  GROUP BY MONTH & LIST TOURS PER MONTH

    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    //  ADD MONTH FIELD
    {
      $addFields: { month: '$_id' },
    },

    //  HIDE ID FIELD
    {
      $project: {
        _id: 0,
      },
    },

    //  SORT BY THE NUMBER OF TOURS
    {
      $sort: { numTourStats: 1 },
    },

    //  SHOW ONLY THE FIRST 5 MONTHS
    {
      $limit: 5,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // } catch (err) {
  //   console.error(err);
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please Provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  console.log(distance, lat, lng, unit);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
