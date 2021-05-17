const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

/// 1) MIDDLEWARES

//Used to use middlewares in the requests
// A middleware defined this way applies to all the routes declared after this.
// All the middlewares are executed in the order they are declared
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//This is similar to creating a new sub-app for each of our resources.
//This is known as Mounting of routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/// 4) START SERVER

module.exports = app;
