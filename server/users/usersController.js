var usersModel = require('./usersModel.js');

module.exports = {
  getAllUsers : function (req, res){
    console.log("getting users");
    usersModel.user.get()
      .then(function(users) {
        res.status(200);
        res.send(users);
      });
  }, 

  getUser : function (req, res){
    console.log("getting user ", req.params.id);
    usersModel.user.get(req.params.id)
      .then(function(users) {
        res.status(200);
        res.send(users);
      });
  }, 

  createUser : function (req, res){
    console.log("creating user ", req.body);
    usersModel.user.post(req.body)
      .then(function (data){
        res.status(201);
        res.send(data);
      });
  },

  updateUser : function (req, res) {
    console.log('updating user ', req.params.id);
    usersModel.user.put(req.params.id, req.body)
      .then(function (data) {
        res.status(200);
        res.send(data);
      });
  }
};
