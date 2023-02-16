/**
 * TOURS ROUTING & ROUTE MOUNTING
 */
const express = require('express');

const router = express.Router();
const tourControler = require('../controlers/tourControler');
const authControler = require('../controlers/authControler');
// const reviewControler = require('../controlers/reviewControler');
const reviewRouter = require('./reviewRoutes');

//CUSTOM MIDDLEWARE TO SPECIFIC PARAMETER
//  PARAM MIDDLEWARE

// router.param('id', tourControler.checkID);

router
  .route('/top-5-tours')
  .get(tourControler.aliasTopTours, tourControler.getAllTours);

router.route('/tour-stats').get(tourControler.getToursStats);

router
  .route('/monthly-plan/:year')
  .get(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    tourControler.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')

  // /tours/tours-within/200/center/0.846561, 37.531751/unit/km
  .get(tourControler.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourControler.getDistances);

router
  .route('/')
  .get(tourControler.getAllTours)
  .post(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-gude'),
    tourControler.createTour
  );

router
  .route('/:id')
  .get(tourControler.getTour)
  .patch(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    tourControler.updateTour
  );

router
  .route('/:id')
  .delete(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    tourControler.deleteTour
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authControler.protect,
//     authControler.restrictTo('user'),
//     reviewControler.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
