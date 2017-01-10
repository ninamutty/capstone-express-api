'use strict';

const mongoose = require('mongoose');

var subscriptionSchema = new mongoose.Schema({
  "name": String,
  "cost": Number,
  "nextBillingDate": Date,
  "notificationDate": Date,
  "firstBillDate": Date,
  "billingCycle": String,
  "daysBeforeBilling": Number,
  // "trialSubscription": Boolean,
  "category": String,
  "userRating": Number
  // "user_id": {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var trialSchema = new mongoose.Schema({
  "name": String,
  "cost": Number,
  "nextBillingDate": Date,
  "notificationDate": Date,
  "firstBillDate": Date,
  "billingCycle": String,
  "daysBeforeBilling": Number,
  "category": String,
  "userRating": Number
});


var usersSchema = new mongoose.Schema({
  "name": String,
  "email": String,
  "password": String,
  "subscriptions": [subscriptionSchema],
  "trials": [trialSchema]
});

var model = mongoose.model("User", usersSchema);

module.exports = model;
