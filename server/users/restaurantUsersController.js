var restaurantUsersModel = require('./restaurantUsersModel.js');

module.exports = {
  getUser : function (req, res) {
    restaurantUsersModel.restaurantUser.get(req.params.id)
      .then(function (data) {
        res.status(200);
        res.send(data);
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
