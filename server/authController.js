var jwt = require('jsonwebtoken');
var Users = require('./users/usersModel.js').user;
var bcrypt = require('bcryptjs');

module.exports = {
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
            var token = jwt.sign(profile, 'feline', { expiresIn: 300 });
            res.status(200).json({token: token});
          } else {
            res.status(401).send('Wrong username or password');
          }
        });
      }
    });
  },

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
            var token = jwt.sign(profile, 'feline', { expiresIn: 300 });
            res.status(201).json({token: token});
          });
        });
      } else {
        res.send(409);
      }
    });
  }
};