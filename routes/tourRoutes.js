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

router.route('/monthly-plan/:year').get(tourControler.getMonthlyPlan);

router
  .route('/top-5-tours')
  .get(tourControler.aliasTopTours, tourControler.getAllTours);

router.route('/tour-stats').get(tourControler.getToursStats);

router
  .route('/')
  .get(authControler.protect, tourControler.getAllTours)
  .post(tourControler.createTour);

router
  .route('/:id')
  .get(tourControler.getTour)
  .delete(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    tourControler.deleteTour
  )
  .patch(tourControler.updateTour);

// router
//   .route('/:tourId/reviews')
//   .post(
//     authControler.protect,
//     authControler.restrictTo('user'),
//     reviewControler.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
