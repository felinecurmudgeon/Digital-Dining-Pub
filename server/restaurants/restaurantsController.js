var restaurantsModel = require('./restaurantsModel.js');

module.exports = {
  getRestaurants : function (req, res) {
    console.log('getting restaurant ', req.params.id);
    restaurantsModel.restaurant.get(req.params.id)
      .then(function (data){
        res.status(200);
        res.send(data);
      });
  },

  createRestaurant : function (req, res) {
    console.log('creating restaurant ');
    restaurantsModel.restaurant.post(req.body)
      .then(function (data){
        res.status(201);
        res.send(data);
      });
  },

  updateRestaurant : function (req, res) {
    console.log('updating restaurant ', req.params.id);
    restaurantModel.restaurant.put(req.body, req.params.id)
      .then(function (data) {
        res.status(201);
        res.send(data);
      });
  },

  deleteRestaurant : function (req, res) {
    console.log('deleting restaurant ', req.params.id);
    restaurantModel.restaurant.delete(req.params.id)
      .then(function (data){
        res.status(204);
        res.send(data);
      });
  }
};
