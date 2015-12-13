/*jshint camelcase: false */
var jwt = require('jsonwebtoken');
var Users = require('./../users/usersModel.js').user;
var bcrypt = require('bcryptjs');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

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
            var token = jwt.sign(profile, process.env.DDJWTSECRET);
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
          .then(function (insertedUser) {
            //post does not return the full user profile.  we must make a get to retrieve the info.
            Users.get(insertedUser.insertId).then(function (retrievedUser) {
              var profile = {
                username: retrievedUser[0].username,
                userID: retrievedUser[0].id
              };
              var token = jwt.sign(profile, process.env.DDJWTSECRET);
              res.status(201).json({token: token});
            });
          });
        });
      } else {
        res.sendStatus(409);
      }
    });
  },
  initializePassportFB: function () {
    passport.use(new FacebookStrategy({
      clientID : process.env.DDFBCLIENTID,
      clientSecret : process.env.DDFBCLIENTSECRET,
      callbackURL : '/api/auth/callback'
    },
    // facebook will send back the token and profile
    function (token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function () {

        // find the user in the database based on their facebook id
        Users.getByFBID(profile._json.id).then(function (user) {
            // if the user is found, then log them in
            if (user.length > 0) {
              return done(null, user[0]);
            } else {
              // if there is no user found with that facebook id, create them
              var newUser = {};

              // set all of the facebook information in our user model
              newUser.facebook_id = profile._json.id;
              newUser.username = profile._json.name;

              // save our user to the database
              Users.post(newUser).then(function (insertedUser) {
                //the return of the post is not the user, but metadata about the insertion of the user into the db
                //we must do a 'get' to get the true user information
                Users.get(insertedUser.insertId).then(function (retrievedUser) {
                  return done(null, retrievedUser[0]);
                });
              });
            }
        }).catch(function (err) {
          console.log('Error searching for user in DB:', err);
        });
      });
    }));
  },
  facebookLogin: function () {
    return passport.authenticate('facebook', {
      scope: ['email'],
      failureRedirect: '/#/app',
      session: false
    });
  },
  facebookCallback: function (req, res, next) {
    passport.authenticate('facebook', function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('http://localhost:8100/#/app');
      }
      var profile = {
        username: user.username,
        userID: user.id
      };
      var token = jwt.sign(profile, process.env.DDJWTSECRET);
      res.redirect('http://localhost:8100/#/successFBLogin?token=' + token);
    })(req, res, next);
  }
};