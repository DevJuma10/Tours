const mongoose = require('mongoose');

/**
 * text
 * reating
 * createdat
 * reference to tour
 * reference to user
 */

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'review must belong to a tour'],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'review must belong to user'],
  },
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
}),

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
