const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour.',
});

/// 1) GLOBAL MIDDLEWARES
//Used to use middlewares in the requests
// A middleware defined this way applies to all the routes declared after this.
// All the middlewares are executed in the order they are declared

// Set Security HTTP headers
app.use(helmet());

// Limit requests from the same API
app.use('/api', limiter);

// Body parser, reading data from body to req.body()
app.use(express.json({ limit: '10kb' }));

//Data sanitization against No SQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent paramter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'difficulty',
    ],
  })
);

// Development Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//This is similar to creating a new sub-app for each of our resources.
//This is known as Mounting of routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

/// 4) START SERVER

module.exports = app;
