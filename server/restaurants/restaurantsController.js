var restaurantModel = require('./restaurantsModel.js');

module.exports = {
  getAllRestaurants : function (req, res){
    console.log("getting restaurant");
    res.status(200);
    res.send("stub success");
  }, 

  getRestaurant : function (req, res){
    console.log("getting restaurant ", req.params.id);
    res.status(200);
    res.send("stub success");
  }, 

  createRestaurant : function (req, res){
    console.log("creating restaurant ");
    res.status(201);
    res.send("stub success");
  },

  updateRestaurant : function (req, res){
    console.log("updating restaurant ", req.params.id);
    res.status(200);
    res.send("stub success");
  },

  deleteRestaurant : function (req, res){
    console.log("delete restaurant ", req.params.id);
    res.status(200);
    res.send("stub success");
  }
};
