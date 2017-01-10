'use strict';

var express = require('express');
var router = require('./api/index.js');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var User   = require('./models/user'); // get our mongoose model
var cors = require('cors');

var app = express();

require('./seeds/users.js');


var port = process.env.PORT || 3000; // used to create, sign, and verify tokens

// connect to database
mongoose.connect(config.database, function(err) {
  if (err) {
    console.log('Failed to connect to mongodb!');
  } else {
    console.log('Successfully connected to Mongo!');
  }
});

app.set('superSecret', config.secret); // secret variable

router.get('/', function(req, res) {
  res.send('Hello and Welcome! The API is at http://localhost:' + port + '/api');
});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port);
console.log('Magic happens at http://localhost:' + port);



app.use('/api', router);  //first parameter is name space and second route is the router - routes will automatically be added
