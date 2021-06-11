const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' ws://localhost:*/ http://localhost:*/* https://*.mapbox.com https://js.stripe.com/v3/ https://api.mapbox.com https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' http://localhost:*/* data:;object-src 'none';script-src https://js.stripe.com/v3/ https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('overview', {
      title: 'All tours',
      tours,
    });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' ws://localhost:*/ http://localhost:*/* https://*.mapbox.com https://js.stripe.com/v3/ https://api.mapbox.com https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' http://localhost:*/* data:;object-src 'none';script-src https://js.stripe.com/v3/ https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('overview', {
      title: 'My tours',
      tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour (including reviews and tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  // 2) Build template
  // 3) Render template using 1)
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' ws://localhost:*/ http://localhost:*/* https://*.mapbox.com https://js.stripe.com/v3/ https://api.mapbox.com https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' http://localhost:*/* data:;object-src 'none';script-src https://js.stripe.com/v3/ https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' ws://localhost:*/ http://localhost:*/* https://*.mapbox.com https://js.stripe.com/v3/ https://api.mapbox.com https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' http://localhost:*/* data:;object-src 'none';script-src https://js.stripe.com/v3/ https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('login', {
      title: 'Login to your account',
    });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' ws://localhost:*/ http://localhost:*/* https://*.mapbox.com https://js.stripe.com/v3/ https://api.mapbox.com https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' http://localhost:*/* data:;object-src 'none';script-src https://js.stripe.com/v3/ https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('account', {
      title: 'Your Account',
      user: updatedUser,
    });
});
