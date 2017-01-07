'use strict';

const mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost/capstone-express-api', function(err) {
  if (err) {
    console.log('Failed to connect to mongodb!');
  } else {
    console.log('Successfully connected to Mongo!');
  }
});
