'use strict';

var express = require('express');
var router = require('./api/index.js');
// var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var User   = require('./models/user'); // get our mongoose model


var app = express();

// require('./database.js');
// require('./seeds/subscriptions.js');
require('./seeds/users.js');
// require('./api/index.js');


var port = process.env.PORT || 3000; // used to create, sign, and verify tokens

// connect to database
mongoose.connect(config.database, function(err) {
  if (err) {
    console.log('Failed to connect to mongodb!');
  } else {
    console.log('Successfully connected to Mongo!');

    // User.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, user) {
    //   console.log( user );
    // });
  }
});

app.set('superSecret', config.secret); // secret variable

router.get('/', function(req, res) {
  res.send('Hello and Welcome! The API is at http://localhost:' + port + '/api');
});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port);
console.log('Magic happens at http://localhost:' + port);


// route middleware to verify a token
// router.use(function(req, res, next) {
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   // decode token
//   if (token) {
//     // verifies secret and checks exp
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     // if there is no token
//     // return an error
//     return res.status(403).send({
//         success: false,
//         message: 'No token provided.'
//     });
//   }
// });


// route to show a random message (GET http://localhost:8080/api/)
// route to return all users (GET http://localhost:8080/api/users)
// apply the routes to our application with the prefix /api

app.use('/api', router);  //first parameter is name space and second route is the router - routes will automatically be added
