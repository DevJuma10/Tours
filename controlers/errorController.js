const AppError = require('../utils/appError');

const handleCastErrorBD = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid Token, Please log-in', 401);

const handleJWTExpiredError = () =>
  new AppError('Your Token has expired, Please Log in again, 401');

const sendDevelopmentError = (err, req, res) => {
  // development errors - (a lot more detailed)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProductionError = (err, res) => {
  //  production errors (minimal details)

  // operational. trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: Dont leak details
  } else {
    //1) Log error
    console.error('ERROR', err);

    //2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

// GLOBAL ERROR HANDLING MIDDLEWARE
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  //DEFINE A DEFAULT STATUS CODE FOR ERRORS
  err.statusCode = err.statusCode || 500; //internal server error
  err.status = err.satus || 'error';

  // Returning different errors depending on environment (production | development)
  if (process.env.NODE_ENV === 'development') {
    // send dev error
    sendDevelopmentError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // send producton errors
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;

    //operational errors
    if (error.name === 'CastError ') error = handleCastErrorBD(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'TokenExporedError')
      error = handleJWTExpiredError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    sendProductionError(error, res);
  }
};
