var jwt = require('jsonwebtoken');
var Users = require('./../users/usersModel.js').user;
var bcrypt = require('bcryptjs');
//var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = {
  //check username and password in the DB.  If no match, send 401. If there is a match, send the client back a JWT.
  signin: function (req, res) {
    Users.getByUsername(req.body.username)
    .then(function (user) {
      if (user.length === 0) {
         res.status(401).send('Wrong username or password');
         return;
      } else {
        bcrypt.compare(req.body.password, user[0].password, function (err, match) {
          if (match) {
            var profile = {
              username: user[0].username,
              userID: user[0].id
            };
            var token = jwt.sign(profile, 'feline'); //TODO: make the secret private (environment variable?)
            res.status(200).json({token: token});
          } else {
            res.status(401).send('Wrong username or password');
          }
        });
      }
    });
  },

  //check if username is taken.  if so, respond 401.  If not, create user in DB and send client back a JWT.
  signup: function (req, res) {
    Users.getByUsername(req.body.username)
    .then(function (user) {
      if (user.length === 0) {
        bcrypt.hash(req.body.password, 8, function (err, hash) {
          Users.post({
            username: req.body.username,
            password: hash
          })
          .then(function (createdUser) {
            var profile = {
              username: createdUser.username,
              userID: createdUser.id
            };
            var token = jwt.sign(profile, 'feline'); //TODO: make the secret private (environment variable?)
            res.status(201).json({token: token});
          });
        });
      } else {
        res.send(409);
      }
    });
  }
  // initializePassportFB: function (passport) {
  //   passport.use(new FacebookStrategy({
  //     clientID        : '913441202085272',
  //     clientSecret    : '516cfc8fad214d32d5453aea36707bcf',
  //     callbackURL     : '/api/auth/callback'
  //   })
    // facebook will send back the token and profile
    /*function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            Users.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));
  }
};


// var LocalStrategy    = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;

// // load up the user model
// var User       = require('../app/models/user');

// // load the auth variables
// var configAuth = require('./auth');

// module.exports = function(passport) {

//     // used to serialize the user for the session
//     passport.serializeUser(function(user, done) {
//         done(null, user.id);
//     });

//     // used to deserialize the user
//     passport.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//             done(err, user);
//         });
//     });
//     // code for login (use('local-login', new LocalStategy))
//     // code for signup (use('local-signup', new LocalStategy))

//     // =========================================================================
//     // FACEBOOK ================================================================
//     // =========================================================================
//     passport.use(new FacebookStrategy({

//         // pull in our app id and secret from our auth.js file
//         clientID        : configAuth.facebookAuth.clientID,
//         clientSecret    : configAuth.facebookAuth.clientSecret,
//         callbackURL     : configAuth.facebookAuth.callbackURL

//     },

//     // facebook will send back the token and profile
//     function(token, refreshToken, profile, done) {

//         // asynchronous
//         process.nextTick(function() {

//             // find the user in the database based on their facebook id
//             User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

//                 // if there is an error, stop everything and return that
//                 // ie an error connecting to the database
//                 if (err)
//                     return done(err);

//                 // if the user is found, then log them in
//                 if (user) {
//                     return done(null, user); // user found, return that user
//                 } else {
//                     // if there is no user found with that facebook id, create them
//                     var newUser            = new User();

//                     // set all of the facebook information in our user model
//                     newUser.facebook.id    = profile.id; // set the users facebook id
//                     newUser.facebook.token = token; // we will save the token that facebook provides to the user
//                     newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
//                     newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

//                     // save our user to the database
//                     newUser.save(function(err) {
//                         if (err)
//                             throw err;

//                         // if successful, return the new user
//                         return done(null, newUser);
//                     });
//                 }

//             });
//         });

//     }));*/

};