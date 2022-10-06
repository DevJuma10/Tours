const express = require('express');

const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

/**
 * 3rd PARTY MIDDLEWARE
 * loger middleware
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * CREATING CUSTOM MIDDLEWARE
 */

app.use((req, res, next) => {
  console.log('HELLO FROM THE MIDDLE_WARE');
  next();
});

app.use((req, res, next) => {
  req.requestDate = new Date().toString();
  next();
});

//ROUTING
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

module.exports = app;
