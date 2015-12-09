var jwt = require('jsonwebtoken');
var Users = require('/users/usersModel.js');
//var bcrpyt = require('bcrypt');

module.exports = {
  signin: function (req, res) {
    Users.get(req.body.username)
    .then(function(user){
      if(user){

      }
    });
    if (true) {
      var profile = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        id: 123
      };

      var token = jwt.sign(profile, 'feline', { expiresInMinutes: 300 });

      res.json({ token: token });
    } else {
      res.send(401, 'Wrong user or password');
      return;
    }
  },

  signup: function(req, res){
    Users.get(req.body.username)
    .then(function(user){
      if(user){
        res.send(409);
      } else {
        var profile = {
          name: user.name,
          id: user.id
        };
        var token = jwt.sign(profile, 'feline', { expiresInMinutes: 300 });
        res.json({token:token});
      }
    });
    //is username taken?
    //if so, error
    //if not, write to DB
      //send jwt

  }
};