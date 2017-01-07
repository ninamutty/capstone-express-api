'use strict';

var express = require('express');
var Subscription = require('../models/subscription');
var router = express.Router();

//comment out mock data because we're connecting to database
// var todos = require('../../mock/todos.json');

//Get all subscriptions
router.get('/subscriptions', function(req, res) {
  Subscription.find({}, function(err, subscriptions) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.json({subscriptions: subscriptions});
  });
});

//Create new subscription
router.post('/subscriptions', function(req, res) {
  var subscription = req.body;
  Subscription.create(subscription, function(err, subscription) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'subscription': subscription, "message": 'Subscription Created'});
  });
});


// Update a Subscription
router.put('/subscriptions/:id', function(req, res) {
  var id = req.params.id
  var subscription = req.body;

  if (subscription && subscription._id !== id) {
    return res.status(500).json({err: "Ids don't match"});
  }

  Subscription.findByIdAndUpdate(id, subscription, {new: true}, function(err, subscription) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'subscription': subscription, "message": 'Subscription Updated'});
  });
});



module.exports = router;
