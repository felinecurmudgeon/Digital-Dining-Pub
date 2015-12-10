/*jshint camelcase: false */
var restaurantsModel = require('./restaurantsModel.js');
var JsonResponseObj = require('../JsonResponseObject.js');
var JsonDataObj = require('../JsonDataObject.js');
var JsonResponseObject = new JsonResponseObj();

module.exports = {
  getRestaurants : function (req, res) {
    console.log('getting restaurant ', req.params.id);
    restaurantsModel.restaurant.get(req.params.id)
      .then(function (data) {
        for (var i = 0; i < data.length; i++) {
          var JsonDataObject = new JsonDataObj();
          JsonDataObject.type = 'restaurants';
          JsonDataObject.id = data[i].id;
          JsonDataObject.attributes = {
            restaurantName: data[i].restaurant_name,
            restaurantOwnerId: data[i].restaurant_owner_id,
            restaurantAddress: data[i].restaurant_address,
            restaurantCity: data[i].restaurant_city,
            restaurantState: data[i].restaurant_state,
            restaurantZipCode: data[i].restaurant_zip_code,
            openingHourMonday: data[i].opening_hour_monday,
            closingHourMonday: data[i].closing_hour_monday,
            openingHourTuesday: data[i].opening_hour_tuesday,
            closingHourTuesday: data[i].closing_hour_tuesday,
            openingHourWednesday: data[i].opening_hour_wednesday,
            closingHourWednesday: data[i].closing_hour_wednesday,
            openingHourThursday: data[i].opening_hour_thursday,
            closingHourThursday: data[i].closing_hour_thursday,
            openingHourFriday: data[i].opening_hour_friday,
            closingHourFriday: data[i].closing_hour_friday,
            openingHourSatday: data[i].opening_hour_saturday,
            closingHourSatday: data[i].closing_hour_saturday,
            openingHourSunday: data[i].opening_hour_sunday,
            closingHourSunday: data[i].closing_hour_sunday
          };
          JsonResponseObject.data.push(JsonDataObject);
        }
        res.status(200);
        res.send(JsonResponseObject);
      });
  },

  createRestaurant : function (req, res) {
    console.log('creating restaurant ');
    restaurantsModel.restaurant.post(req.body)
      .then(function (data) {
        res.status(201);
        res.send(data);
      });
  },

  updateRestaurant : function (req, res) {
    console.log('updating restaurant ', req.params.id);
    restaurantsModel.restaurant.put(req.body, req.params.id)
      .then(function (data) {
        res.status(201);
        res.send(data);
      });
  },

  deleteRestaurant : function (req, res) {
    console.log('deleting restaurant ', req.params.id);
    restaurantsModel.restaurant.delete(req.params.id)
      .then(function (data) {
        res.status(204);
        res.send(data);
      });
  }
};
