const express = require('express');

const router = express.Router({ mergeParams: true });
const reviewControler = require('../controlers/reviewControler');
const authControler = require('../controlers/authControler');

router.use(authControler.protect);

// eslint-disable-next-line prettier/prettier
router.route('/').get(reviewControler.getAllReviews);

router
  .route('/')
  .post(
    authControler.restrictTo('user'),
    reviewControler.setToursAndUserId,
    reviewControler.createReview
  );

router
  .route('/:id')
  .get(reviewControler.getReview)
  .delete(reviewControler.deleteReview)
  .patch(
    authControler.restrictTo('user', 'admin'),
    reviewControler.updateReview
  );

module.exports = router;
