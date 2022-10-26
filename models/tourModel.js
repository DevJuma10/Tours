const mongoose = require('mongoose');

//  CREATE SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
  },

  rating: {
    type: Number,
    default: 3.5,
  },

  price: {
    type: Number,
    required: true,
  },

  premium: {
    type: Boolean,
    default: false,
  },
});

//  CREATING A SIMPLE TOUR MODEL
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
