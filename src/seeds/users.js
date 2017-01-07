'use strict';

var User = require('./../models/user.js');

var users = [
  {
    name: "Nina Mutty",
    email: "nina@me.com"
  }, {
    name: "Sam Mutty",
    email: "sam@me.com"
  }, {
    name: "Buck Mutty",
    email: "buck@me.com"
  }
];

users.forEach(function(user, index) {
  // find by name will need to change to user and name when users are included
  User.find({'name': user.name}, function(err, users) {
    if (!err && !users.length) {
      User.create({
        name: user.name,
        email: user.email
      });
    };
  });
});
