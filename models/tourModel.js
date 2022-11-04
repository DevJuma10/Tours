const mongoose = require('mongoose');
const slugify = require('slugify');

//  CREATE SCHEMA
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,

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

    secret: {
      type: Boolean,
      default: false,
    },
  },

  //  OPTIONS
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// CREATING VIRTUAL PROPERTIES

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//  DOCUMENT MIDDLEWARE (pre-middleware): runs before .save() aand .create()

tourSchema.pre('save', function (next) {
  (this.slug = slugify(this.name)), { lower: true };
  next();
});

tourSchema.pre('save', function (next) {
  console.log('Saving Document ...');
  next();
});

//  DOCUMENT MIDDLEWARE (post-middleware): runs after .save() aand .create()

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

//  QUERRY MIDDLEWARE
//  pre-find

// tourSchema.pre('find', function (next) {
//   next();
// });

// filter out secret tours from all find operations (find(), findById, findOne)
tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  this.start = Date.now();
  next();
});

// post-find
tourSchema.post(/^find/, function (doc, next) {
  console.log(
    `The Querry was completed in ${Date.now() - this.start} milliseconds`
  );
  // console.log(doc);
  next();
});

//  AGGREGATION MIDDLEWARE

//  adds a filter to filter out secret tours

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

//  CREATING A SIMPLE TOUR MODEL
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
