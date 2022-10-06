/**
 * TOURS ROUTING & ROUTE MOUNTING
 */
const express = require('express');

const router = express.Router();
const tourControler = require('../controlers/tourControler');

//CUSTOM MIDDLEWARE TO SPECIFIC PARAMETER
//  PARAM MIDDLEWARE

router.param('id', tourControler.checkID);

router
  .route('/')
  .get(tourControler.getAllTours)
  .post(tourControler.checkBody, tourControler.createTour);

router
  .route('/:id')
  .get(tourControler.getTour)
  .delete(tourControler.deleteTour)
  .patch(tourControler.updateTour);

module.exports = router;
