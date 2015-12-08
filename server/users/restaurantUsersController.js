var restaurantUsersModel = require('./restaurantUsersModel.js');

module.exports = {
  getUser : function (req, res) {
    console.log('getting user ', req.params.id);
    restaurantUsersModel.restaurantUser.get(req.params.id)
      .then(function (data) {
        res.status(200);
        res.send(data);
      });
  },

  createUser : function (req, res) {
    console.log('creating user ');
    restaurantUsersModel.restaurantUser.post(req.body)
      .then(function (data) {
        res.status(201);
        res.send(data);
      });
  }
};
