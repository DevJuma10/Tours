const express = require('express');

const router = express.Router;
const reviewControler = require('../controlers/reviewControler');
const authControler = require('../controlers/authControler');

// eslint-disable-next-line prettier/prettier
router('/')
  .get(authControler.protect, reviewControler.getAllReviews)
  .post(
    authControler.protect,
    authControler.restrictTo('user'),
    reviewControler.createReview
  );

module.exports = router;
