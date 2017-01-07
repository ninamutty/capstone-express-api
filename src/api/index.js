'use strict';

var express = require('express');
var Subscription = require('../models/subscription.js');
var User = require('../models/user.js');
var router = express.Router();


// Need to add users to reference to for new subscriptions


router.get('/', function(req, res) {
  res.json({"welcome": "MY API!"})
});

////////////////
/// '/users' ///
////////////////
//Get all subscriptions
router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({users: users});
  });
});

//Get one subscription
router.get('/users/:id', function(req, res) {
  var id = req.params.id

  User.findOne({"_id": id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.json({"user": user});
  });
});

//Create new user
router.post('/users', function(req, res) {
  var user = req.body;
  User.create(user, function(err, user) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'user': user, "message": 'User Created'});
  });
});

// Update a User
router.put('/users/:id', function(req, res) {
  var id = req.params.id
  var user = req.body;

  if (user && user._id !== id) {
    return res.status(500).json({err: "Ids don't match"});
  }

  User.findByIdAndUpdate(id, user, {new: true}, function(err, user) {
    if (err) {
      return res.status(500).json({err: err.message});
    }
    res.json({'user': user, "message": 'User Updated'});
  });
});

//Delete a User
router.delete('/users/:id', function(req, res) {
  var id = req.params.id

  User.findOneAndRemove({"_id": id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({"message": "User Deleted"});
  });
});





///////////////////////
/// '/subcriptions' ///
///////////////////////

//Get all subscriptions
router.get('/subscriptions', function(req, res) {
  Subscription.find({}, function(err, subscriptions) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({subscriptions: subscriptions});
  });
});

//Get one subscription
router.get('/subscriptions/:id', function(req, res) {
  var id = req.params.id

  Subscription.findOne({"_id": id}, function(err, subscription) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.json({"subscription": subscription});
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


//Delete a Subscription
router.delete('/subscriptions/:id', function(req, res) {
  var id = req.params.id

  Subscription.findOneAndRemove({"_id": id}, function(err, subscription) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({"message": "Subscription Deleted"});
  });
});


module.exports = router;
