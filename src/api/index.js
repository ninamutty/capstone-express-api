'use strict';

var express = require('express');
var Subscription = require('../models/subscription.js');
var User = require('../models/user.js');
var router = express.Router();
const mongoose = require('mongoose');


// require('./subscriptions_path.js');
// require('./users_path.js');

// 
// router.post('/authenticate', function(req, res) {
//   // find the user
//   User.findOne({
//     email: req.body.email
//   }, function(err, user) {
//     if (err) throw err;
//     if (!user) {
//       res.json({ success: false, message: 'Authentication failed. User not found.' });
//     } else if (user) {
//       // check if password matches
//       if (user.password != req.body.password) {
//         res.json({ success: false, message: 'Authentication failed. Wrong password.' });
//     } else {
//       // if user is found and password is right
//         // create a token
//         var token = jwt.sign(user, app.get('superSecret'), {
//           expiresInMinutes: 1440 // expires in 24 hours
//         });
//         // return the information including token as JSON
//         res.json({
//           success: true,
//           message: 'Enjoy your token!',
//           token: token
//         });
//       }
//     }
//   });
// });


// route middleware to verify a token
// router.use(function(req, res, next) {
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   // decode token
//   if (token) {
//     // verifies secret and checks exp
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     // if there is no token
//     // return an error
//     return res.status(403).send({
//         success: false,
//         message: 'No token provided.'
//     });
//   }
// });


// ////////////////
// /// '/users' ///
// ////////////////

//Get all users
router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({users: users});
  });
});

//Get one user
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





////////////////////////////////////
/// 'user/:user_id/subcriptions' ///
////////////////////////////////////

//Get all subscriptions for a user
router.get('/users/:user_id/subscriptions', function(req, res) {
  var user_id =  mongoose.Types.ObjectId(req.params.user_id);
  // console.log(user_id);

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




////////////////////////////////////
/// 'user/:user_id/trials' ///
////////////////////////////////////

//Get all trial subscriptions for a user
router.get('/users/:user_id/trials', function(req, res) {
  var user_id =  mongoose.Types.ObjectId(req.params.user_id);

  Subscription.find({"user_id": user_id, "trialSubscription": true}, function(err, subscriptions) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({subscriptions: subscriptions});
  });
});

//Get all non-trial subscriptions for a user
router.get('/users/:user_id/non-trials', function(req, res) {
  var user_id =  mongoose.Types.ObjectId(req.params.user_id);

  Subscription.find({"user_id": user_id, "trialSubscription": false}, function(err, subscriptions) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    res.status(200).json({subscriptions: subscriptions});
  });
});



module.exports = router;
