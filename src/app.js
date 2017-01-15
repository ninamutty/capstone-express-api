'use strict';
require('dotenv').config()
var express = require('express');
var router = require('./api/index.js');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var expressJWT = require('express-jwt'); // used to create, sign, and verify tokens

var User   = require('./models/user'); // get our mongoose model
var cors = require('cors');

var app = express();

// require('./seeds/users.js');


var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

// connect to database
mongoose.connect(process.env.DB_URL, function(err) {
  if (err) {
    console.log('Failed to connect to mongodb!');
  } else {
    console.log('Successfully connected to Mongo!');
  }
});

app.use(expressJWT({secret: process.env.SECRET}).unless({path: ['/login']})); // secret variable

router.get('/', function(req, res) {
  res.send('Hello and Welcome! The API is at http://localhost:' + port + '/api');
});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/login', function(req, res) {
  if(!req.body.email) {
    return res.status(400).send('email required');
  }
  if(!req.body.password) {
    return res.status(400).send('password required');
  }
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) throw err;
    if (req.body.password !== user.password) {
      res.status(401).send("Invalid Password");
    } else {
      var myToken = jwt.sign({email: req.body.email}, process.env.SECRET)
      res.status(200).json(myToken);
    }
  })

});




app.listen(port);
console.log('Magic happens at http://localhost:' + port);

app.use('/api', router);  //first parameter is name space and second route is the router - routes will automatically be added
