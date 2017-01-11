'use strict';

var User = require('./../models/user.js');

var users = [
  {
    name: "Nina Mutty",
    email: "nina@me.com",
    username: "nmutty",
    password: 'password',
    subscriptions: [
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
        name: "Spotify",
        cost: 1000,
        nextBillingDate: new Date("Feb 1, 2017"),
        notificationDate: new Date("Jan 30, 2017"),
        firstBillDate: new Date("May 1, 2015"),
        billingCycle: "Monthly",
        daysBeforeBilling: 2,
        category: "Music Streaming",
        userRating: 4.5,
      }],
    trials: [
      {
        name: "DropBox",
        cost: 1000,
        nextBillingDate: new Date("Feb 1, 2017"),
        notificationDate: new Date("Jan 30, 2017"),
        firstBillDate: new Date("Feb 1, 2017"),
        billingCycle: "Monthly",
        daysBeforeBilling: 2,
        category: "Cloud Storage",
        userRating: null,
      }
    ]
  }, {
    name: "Sam Mutty",
    email: "sam@me.com",
    username: 'sam',
    password: 'password',
    subscriptions: [
      {
        name: "Netflix",
        cost: 1000,
        nextBillingDate: new Date("Feb 1, 2017"),
        notificationDate: new Date("Jan 30, 2017"),
        firstBillDate: new Date("Feb 1, 2014"),
        billingCycle: "Monthly",
        daysBeforeBilling: 2,
        category: "Video Streaming",
        userRating: 4.5,
      }
    ],
    trials: []
  }, {
    name: "Buck Mutty",
    email: "buck@me.com",
    username: 'buck',
    password: 'password',
    subscriptions: [],
    trials: []
  }
];

users.forEach(function(user, index) {
  // find by name will need to change to user and name when users are included
  User.find({'email': user.email}, function(err, users) {
    if (!err && !users.length) {
      var newUser = new User({
        name: user.name,
        email: user.email,
        username: user.username,
        password: user.password,
        subscriptions: [],
        trials: []
      });
      user.subscriptions.forEach(function(subscription, index) {
        newUser.subscriptions.push({
          name: subscription.name,
          cost: subscription.cost,
          nextBillingDate: subscription.nextBillingDate,
          notificationDate: subscription.notificationDate,
          firstBillDate: subscription.firstBillDate,
          billingCycle: subscription.billingCycle,
          daysBeforeBilling: subscription.daysBeforeBilling,
          category: subscription.category,
          userRating: subscription.userRating,
        }); //end newUser.subscriptions
      }); // end users.subscriptions
      user.trials.forEach(function(trial, index) {
        newUser.trials.push({
          name: trial.name,
          cost: trial.cost,
          nextBillingDate: trial.nextBillingDate,
          notificationDate: trial.notificationDate,
          firstBillDate: trial.firstBillDate,
          billingCycle: trial.billingCycle,
          daysBeforeBilling: trial.daysBeforeBilling,
          category: trial.category,
          userRating: trial.userRating,
        }); //end newUser.trials
      }); // end users.trials

      newUser.save()
    }; // end if
  }); //end User.find
}); //end users.forEach
