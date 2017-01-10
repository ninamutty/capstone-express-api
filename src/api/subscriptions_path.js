'use strict';

var express = require('express');
var Subscription = require('../models/subscription.js');
var User = require('../models/user.js');
var router = express.Router();
const mongoose = require('mongoose');

// require('./users_path.js');



////////////////////////////////////
/// 'user/:user_id/subcriptions' ///
////////////////////////////////////

//Get all subscriptions for a user
router.get('/users/:user_id/subscriptions', function(req, res) {
  var user_id =  mongoose.Types.ObjectId(req.params.user_id);
  console.log(user_id);

  Subscription.find({"user_id": user_id}, function(err, subscriptions) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({subscriptions: subscriptions});
  });
});


router.get('/subscriptions', function(req, res) {

  Subscription.find({}, function(err, subscriptions) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.json({"subscriptions": subscriptions});
  });
});


//Get one subscription
router.get('/users/:user_id/subscriptions/:id', function(req, res) {
  var id = req.params.id
  var user_id =  mongoose.Types.ObjectId(req.params.user_id);

  Subscription.find().and([{"user_id": user_id}, {"_id": id}]).exec(function(err, subscription) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.json({"subscription": subscription});
  });
});


// todo: Be able to creat new, edit, delete subscriptions that correspond to a user

//Create new subscription for a user
router.post('/users/:user_id/subscriptions', function(req, res) {
  var user_id = req.params.user_id
  var subscription = req.body;
  console.log(subscription);

  subscription.user_id = user_id;

  Subscription.create(subscription, function(err, subscription) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'subscription': subscription, "message": 'Subscription Created'});
  });
});


// Update a Subscription for a user
router.put('/users/:user_id/subscriptions/:id', function(req, res) {
  var id = req.params.id
  var user_id = req.params.user_id
  var subscription = req.body;

  var user = User.findById({"_id": user_id})


  if (!subscription || !user) {
    return res.status(404).json({err: "Subscription or User Not Found"});
  } else if (subscription && subscription._id !== id) {
    return res.status(500).json({err: "Ids don't match"});
  } else if (subscription.user_id !== user_id) {
    return res.status(401).json({err: "Not Authorized to Edit this Subscription"})
  }

  // Unique id so don't need worry about it not being the user's
  Subscription.findByIdAndUpdate(id, subscription, {new: true}, function(err, subscription) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'subscription': subscription, "message": 'Subscription Updated'});
  });
});


//Delete a Subscription
router.delete('/users/:user_id/subscriptions/:id', function(req, res) {
  var id = req.params.id
  var user_id = req.params.user_id

  //ADD IN VALIDATIONS

  Subscription.findOneAndRemove({"_id": id}, function(err, subscription) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({"message": "Subscription Deleted"});
  });
});


module.exports = router;
