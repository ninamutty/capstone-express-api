'use strict';

const mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
  "name": String,
  "email": String
});

var model = mongoose.model("User", usersSchema);

module.exports = model;
