var restaurantUsersModel = require('./restaurantUsersModel.js');
var JsonResponseObj = require('../JsonResponseObject.js');
var JsonResponseObject = new JsonResponseObj();
var JsonDataObj = require('../JsonDataObject.js');
var JsonDataObject = new JsonDataObj();

module.exports = {
  getUser : function (req, res) {
    restaurantUsersModel.restaurantUser.get(req.params.id)
      .then(function (data) {
        for (var i = 0; i < data.length; i++) {
          JsonDataObject.type = 'restaurantUsers';
          JsonDataObject.id = data[i].id;
          JsonDataObject.attributes = {
            username: data[i].username,
            password: data[i].password
          };
          JsonResponseObject.data.push(JsonDataObject);
        }
        res.status(200);
        res.send(JsonResponseObject);
      });
  },

  createUser : function (req, res) {
    restaurantUsersModel.restaurantUser.post(req.body)
      .then(function (data) {
        res.status(201);
        res.send(data);
      });
  }
};
