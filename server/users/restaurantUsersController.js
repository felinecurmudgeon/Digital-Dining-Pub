var restaurantUsersModel = require('./restaurantUsersModel.js');

module.exports = {
  getUser : function (req, res){
    console.log("getting user ", req.params.id);
    restaurantUsersModel.restaurantUser.get(req.params.id)
      .then(function (data){
        res.status(200);
        res.send(data);
      });
  }, 

  createUser : function (req, res){
    console.log("creating user ");
    console.log(req.body);
    restaurantUsersModel.restaurantUser.post(req.body)
      .then(function (data){
        res.status(201);
        res.send(data);
      });
  },

  updateUser : function (req, res){
    console.log("updating user ", req.params.id);
    res.status(200);
    res.send("stub success");
  }
}
