const mongoose = require('mongoose');

//  CREATE SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
    trim: true,
  },

  duration: {
    type: Number,
    required: [true, 'Tour muust have a duration'],
  },

  maxGroupSize: {
    type: Number,
    required: [true, 'Tour Must Have a Maximum Group Size '],
  },

  difficulty: {
    type: String,
    required: [true, 'Tour Must Have a Difficulty Level'],
  },

  ratingsAverage: {
    type: Number,
    default: 3.5,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: [true, 'Tour Must Have a Price '],
  },

  priceDiscount: {
    type: Number,
  },

  summary: {
    type: String,
    required: [true, 'Tour Must Have a Summary of the tour'],
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, 'Tour Must Have an image cover'],
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },

  startDates: [Date],

  premium: {
    type: Boolean,
    default: false,
  },
});

//  CREATING A SIMPLE TOUR MODEL
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
