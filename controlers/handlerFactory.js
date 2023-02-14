const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });

/**
 *  UPDATE MODELS
 * @param {Model}
 * @returns updated model
 */

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // try {
    //check for item to be updated
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        document,
      },
    });
  });

/**
 * CREATING MODELS
 */

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        date: newDocument,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query(populateOptions);

    const document = await query;

    if (!document) {
      return next(new AppError('No Tour Found with that ID', 404));
    }

    res.status(200).json({
      status: 'sucesss',
      data: {
        document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //TO ALLOW FOR NESTED GET REVIEWS
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const document = await features.query.explain();
    const document = await features.query;
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        document,
      },
    });

    next();
  });
