'use strict';

var Subscription = require('./models/subscription.js');

var subscriptions = [
  {
    name: "Netflix",
    cost: 1000,
    nextBillingDate: new Date("Feb 1, 2017"),
    notificationDate: new Date("Jan 30, 2017"),
    firstBillDate: new Date("Feb 1, 2014"),
    billingCycle: "Monthly",
    daysBeforeBilling: 2,
    trialSubscription: false,
    category: "Video Streaming",
    userRating: 4.5,
  },
  {
    name: "DropBox",
    cost: 1000,
    nextBillingDate: new Date("Feb 1, 2017"),
    notificationDate: new Date("Jan 30, 2017"),
    firstBillDate: new Date("Feb 1, 2017"),
    billingCycle: "Monthly",
    daysBeforeBilling: 2,
    trialSubscription: true,
    category: "Cloud Storage",
    userRating: null,
  },
  {
    name: "Spotify",
    cost: 1000,
    nextBillingDate: new Date("Feb 1, 2017"),
    notificationDate: new Date("Jan 30, 2017"),
    firstBillDate: new Date("May 1, 2015"),
    billingCycle: "Monthly",
    daysBeforeBilling: 2,
    trialSubscription: false,
    category: "Music Streaming",
    userRating: 4.5,
  },
];

subscriptions.forEach(function(subscription, index) {
  // find by name will need to change to user and name when users are included
  Subscription.find({'name': subscription.name}, function(err, subscriptions) {
    if (!err && !subscriptions.length) {
      Subscription.create({
        name: subscription.name,
        cost: subscription.cost,
        nextBillingDate: subscription.nextBillingDate,
        notificationDate: subscription.notificationDate,
        firstBillDate: subscription.firstBillDate,
        billingCycle: subscription.billingCycle,
        daysBeforeBilling: subscription.daysBeforeBilling,
        trialSubscription: subscription.trialSubscription,
        category: subscription.category,
        userRating: subscription.userRating,
      });
    };
  });
});
