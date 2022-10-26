/**
 * TOUR CONTROLERS
 */
// const fs = require('fs');
const Tour = require('./../models/tourModel');

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
exports.getAllTours = async (req, res) => {
  try {
    // 1) FILTERING

    // QUERY CONSTRUCTION: DESIGNED TO IGNORE THE MENTIONED EXLUDED FIELDS
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Tour.find(JSON.parse(queryStr));

    // EXECUTE QUERY
    const tours = await query;

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(4)
    //   .where('difficulty')
    //   .equals('easy')

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//GET TOUR
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    //Find tour with matching id
    // const tour = tours.filter((el) => el.id === id);

    res.status(200).json({
      status: 'sucesss',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//CREATE TOUR

exports.createTour = async (req, res) => {
  try {
    // const newTour = new  Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

//UPDATE TOUR
exports.updateTour = async (req, res) => {
  try {
    //check for item to be updated
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//DELETE TOUR
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
