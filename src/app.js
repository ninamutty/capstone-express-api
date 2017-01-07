'use strict';

var express = require('express');
var router = require('./api');
var parser = require('body-parser');

var app = express();

require('./database');
require('./seeds/subscriptions.js');
require('./seeds/users.js');


app.use(parser.json());

app.use('/', router);  //first parameter is name space and second route is the router - routes will automatically be added

app.listen(3000, function() {
  console.log("The server is running on port 3000");
});
