/**
 * TOUR CONTROLERS
 */
const fs = require('fs');

//READ DATA FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//  CUSTOM MIDDLEWARE TO VALIDATE ID
exports.checkID = (req, res, next, val) => {
  console.log(`ID is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// CUSTOM MIDDLEWARE TO CHECKBODY
// CHECK IF BOBY CONTAINS NAME AND PRICE
//IF NOT SEND BACK 404 (BAD REQUES)
// ADD IT TO THE POST HANDLER

exports.checkBody = (req, res, next) => {
  if (!req.body.name || req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
  next();
};

//GET ALL TOURS
exports.getAllTours = (req, res) => {
  console.log(req.requestDate);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    date: req.requestDate,
    data: {
      tours,
    },
  });
};

//CREATE TOUR

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = ({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

//GET TOUR
exports.getTour = (req, res) => {
  //string to int conversion of id params
  const id = req.params.id * 1;

  //Find tour with matching id
  const tour = tours.filter((el) => el.id === id);

  res.status(200).json({
    status: 'sucesss',
    data: {
      tour,
    },
  });
};

//UPDATE TOUR
exports.updateTour = (req, res) => {
  //check for item to be updated

  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<  UPDATED TOUR GOES HERE ...>',
    },
  });
};

//DELETE TOUR
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
