'use strict';

const mongoose = require('mongoose');

//  todo.name and todo.completed

var subscriptionsSchema = new mongoose.Schema({
  "name": String,
  "cost": Number,
  "nextBillingDate": Date,
  "notificationDate": Date,
  "firstBillDate": Date,
  "billingCycle": String,
  "daysBeforeBilling": Number,
  "trialSubscription": Boolean,
  "category": String,
  "userRating": Number,
  "user": String
});

var model = mongoose.model("Subscription", subscriptionsSchema);

module.exports = model;