/*jshint camelcase: false */
var usersModel = require('./usersModel.js');
var JsonResponse = require('../JsonResponseObject.js');
var JsonData = require('../JsonDataObject.js');

var createJsonResponseForUsers = function (data) {
  var JsonResponseObject = new JsonResponse();
  data.forEach(function (user) {
    var JsonDataObject = new JsonData();
    JsonDataObject.type = 'users';
    JsonDataObject.id = user.id;
    JsonDataObject.attributes = {
      username: user.username,
      password: user.password,
      stripeId: user.stripe_id,
      facebookId: user.facebook_id,
      isRestaurantUser: user.is_restaurant_user
    };
    JsonResponseObject.data.push(JsonDataObject);
  });
  return JsonResponseObject;
};

module.exports = {
  getAllUsers : function (req, res) {
    console.log('getting users');
    usersModel.user.get(null, req.query.custonly)
      .then(function (data) {
        var response = createJsonResponseForUsers(data);
        res.status(200);
        res.send(response);
      })
      .catch(function (err) {
        res.status(500);
        res.send(err);
      });
  },

  getUser : function (req, res) {
    console.log('getting user ', req.params.id);
    usersModel.user.get(req.params.id)
      .then(function (data) {
        var response = createJsonResponseForUsers(data);
        res.status(200);
        res.send(response);
      })
      .catch(function (err) {
        res.status(500);
        res.send(err);
      });
  },

  createUser : function (req, res) {
    console.log('creating user ', req.body);
    usersModel.user.post(req.body)
      .then(function (data) {
        res.status(201);
        res.send(data);
      })
      .catch(function (err) {
        res.status(500);
        res.send(err);
      });
  },

  updateUser : function (req, res) {
    console.log('updating user ', req.params.id);
    usersModel.user.put(req.params.id, req.body)
      .then(function (data) {
        res.status(200);
        res.send(data);
      })
      .catch(function (err) {
        res.status(500);
        res.send(err);
      });
  }
};
