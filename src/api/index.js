'use strict';

var express = require('express');
// var Subscription = require('../models/subscription.js');
var User = require('../models/user.js');
var router = express.Router();
const mongoose = require('mongoose');
// var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var config = require('../../config'); // get our config file



// require('./subscriptions_path.js');
// require('./users_path.js');



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




////////////////
/// '/users' ///
////////////////

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
router.get('/users/:id/subscriptions', function(req, res) {
  var id =  req.params.id;
  // console.log(user_id);

  User.findOne({"_id": id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    var subscriptions = user.subscriptions;
    res.status(200).json({subscriptions: subscriptions});
  });
});



//Get one subscription for a user
router.get('/users/:user_id/subscriptions/:id', function(req, res) {
  var sub_id = req.params.id
  var user_id =  req.params.user_id;

  User.findOne({"_id": user_id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    var subscription = user.subscriptions.id(sub_id)
    res.json({"subscription": subscription});
  });
});


// todo: Be able to creat new, edit, delete subscriptions that correspond to a user

//Create new subscription for a user
router.post('/users/:id/subscriptions', function(req, res) {
  var id = req.params.id
  var subscription = req.body;

  User.findOne({"_id": id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    user.subscriptions.push(subscription);

    var createdSubscription = user.subscriptions[user.subscriptions.length - 1]
    user.save(function (err) {
      if (err) {
        return res.status(500).json({message: err.message}); // 500 = internal server error
      }
      res.status(200).json({subscription: createdSubscription, "message": 'Subscription Created'});
    });
  });
});



// Update a Subscription for a user
router.put('/users/:user_id/subscriptions/:id', function(req, res) {
  var id = req.params.id
  var user_id = req.params.user_id
  var subscription = req.body;

  User.findOne({"_id": user_id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }

    if (user.subscriptions.id(id)) {
      var update = user.subscriptions.id(id);
      update.name = subscription.name;
      update.cost = subscription.cost;
      update.nextBillingDate = subscription.nextBillingDate;
      update.notificationDate = subscription.notificationDate;
      update.firstBillDate = subscription.firstBillDate;
      update.billingCycle = subscription.billingCycle;
      update.daysBeforeBilling = subscription.daysBeforeBilling;
      update.category = subscription.category;
      update.userRating = subscription.userRating;
    } else {
      return res.status(404).json({message: err.message});
    }

    user.save(function (err) {
      if (err) {
        return res.status(500).json({message: err.message}); // 500 = internal server error
      }
      res.status(200).json({subscription: update, "message": 'Subscription Updated'});
    });

  });

}); //end put


//Delete a Subscription
router.delete('/users/:user_id/subscriptions/:id', function(req, res) {
  var id = req.params.id
  var user_id = req.params.user_id

  //ADD IN VALIDATIONS
  User.findOne({"_id": user_id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }

    if (user.subscriptions.id(id)) {
      var doc = user.subscriptions.id(id).remove();
    } else {
      return res.status(404).json({message: err.message});
    }
    user.save(function(err) {
      if (err) {
        return res.status(500).json({message: err.message}); // 500 = internal server error
      }
      res.status(200).json({"message": "Subscription Deleted"});
    })
  });
});




////////////////////////////////////
/// 'user/:user_id/trials' ///
////////////////////////////////////

//Get all trials for a user
router.get('/users/:id/trials', function(req, res) {
  var id =  req.params.id;
  // console.log(user_id);

  User.findOne({"_id": id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    var trials = user.trials;
    res.status(200).json({trials: trials});
  });
});



//Get one trial for a user
router.get('/users/:user_id/trials/:id', function(req, res) {
  var sub_id = req.params.id
  var user_id =  req.params.user_id;

  User.findOne({"_id": user_id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    var trial = user.trials.id(sub_id)
    res.json({"trial": trial});
  });
});


// todo: Be able to creat new, edit, delete trials that correspond to a user

//Create new trial for a user
router.post('/users/:id/trials', function(req, res) {
  var id = req.params.id
  var trial = req.body;

  User.findOne({"_id": id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }
    user.trials.push(trial);

    var createdSubscription = user.trials[user.trials.length - 1]
    user.save(function (err) {
      if (err) {
        return res.status(500).json({message: err.message}); // 500 = internal server error
      }
      res.status(200).json({trial: createdSubscription, "message": 'Trial Created'});
    });
  });
});



// Update a Subscription for a user
router.put('/users/:user_id/trials/:id', function(req, res) {
  var id = req.params.id
  var user_id = req.params.user_id
  var trial = req.body;

  User.findOne({"_id": user_id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }

    if (user.trials.id(id)) {
      var update = user.trials.id(id);
      update.name = trial.name;
      update.cost = trial.cost;
      update.nextBillingDate = trial.nextBillingDate;
      update.notificationDate = trial.notificationDate;
      update.firstBillDate = trial.firstBillDate;
      update.billingCycle = trial.billingCycle;
      update.daysBeforeBilling = trial.daysBeforeBilling;
      update.category = trial.category;
      update.userRating = trial.userRating;
    } else {
      return res.status(404).json({message: err.message});
    }

    user.save(function (err) {
      if (err) {
        return res.status(500).json({message: err.message}); // 500 = internal server error
      }
      res.status(200).json({trial: update, "message": 'Trial Updated'});
    });

  });

}); //end put


//Delete a Subscription
router.delete('/users/:user_id/trials/:id', function(req, res) {
  var id = req.params.id
  var user_id = req.params.user_id

  //ADD IN VALIDATIONS
  User.findOne({"_id": user_id}, function(err, user) {
    if (err) {
      return res.status(500).json({message: err.message}); // 500 = internal server error
    }

    if (user.trials.id(id)) {
      var doc = user.trials.id(id).remove();
    } else {
      return res.status(404).json({message: "Trial Not Found"});
    }
    user.save(function(err) {
      if (err) {
        return res.status(500).json({message: err.message}); // 500 = internal server error
      }
      res.status(200).json({"message": "Trial Subscription Deleted"});
    })
  });
});




module.exports = router;
