const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
