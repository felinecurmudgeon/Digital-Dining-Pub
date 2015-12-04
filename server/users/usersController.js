module.exports = {
  getAllUsers : function (req, res){
    console.log("getting users");
    res.status(200);
    res.send("stub success");
  }, 

  getUser : function (req, res){
    console.log("getting user ", req.params.id);
    res.status(200);
    res.send("stub success");
  }, 

  createUser : function (req, res){
    console.log("creating user ");
    res.status(201);
    res.send("stub success");
  },

  updateUser : function (req, res){
    console.log("updating user ", req.params.id);
    res.status(200);
    res.send("stub success");
  }
}
