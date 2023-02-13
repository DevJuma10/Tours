const express = require('express');

const router = express.Router({ mergeParams: true });
const reviewControler = require('../controlers/reviewControler');
const authControler = require('../controlers/authControler');

// eslint-disable-next-line prettier/prettier
router.route('/').get(authControler.protect, reviewControler.getAllReviews);

router
  .route('/')
  .post(
    authControler.protect,
    authControler.restrictTo('user'),
    reviewControler.setToursAndUserId,
    reviewControler.createReview
  );

router
  .route('/:id')
  .delete(reviewControler.deleteReview)
  .patch(reviewControler.updateReview);

module.exports = router;
