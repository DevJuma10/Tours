const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

//  CREATE SCHEMA
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have less or equal to 40 characters'],
      minLength: [10, 'Tour  name must have more than 10 characters'],
    },
    slug: String,

    duration: {
      type: Number,
      required: [true, 'Tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'Tour Must Have a Maximum Group Size '],
    },

    difficulty: {
      type: String,
      required: [true, 'Tour Must Have a Difficulty Level'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        messasge: 'Difficulty is either Easy, Medium or Difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 3.5,
      min: [1, 'Rating must be between 1.0 and 5.0'],
      max: [5, 'Rating must be between 1.0 and 5.0'],
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
      validate: {
        validator: function (val) {
          //  this only  points to the current documend on a New document creation
          return val < this.price;
        },
        message: 'Discount  price ({VALUE}) should be below regular price',
      },
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

    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Objectid,
        ref: 'User',
      },
    ],
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

//  DOCUMENT MIDDLEWARE (pre-middleware): runs before .save() aand .create() NOT for update()

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', (next) => {
  console.log('Saving Document ...');
  next();
});

//  DOCUMENT MIDDLEWARE (post-middleware): runs after .save() aand .create()

// eslint-disable-next-line prefer-arrow-callback
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

//  QUERRY MIDDLEWARE
//  pre-find

// tourSchema.pre('find', function (next) {
//   next();
// });

/**
 *  EMBEDDING TOUR GUIDES DATA TO TOURS MODEL
 * 

tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(
    async (id) => await User.findById({ id })
  );
  this.guides = await Promise.all(guidesPromises);
  next();
});

 */

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-passwordChangedAt',
  });

  next();
});

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
