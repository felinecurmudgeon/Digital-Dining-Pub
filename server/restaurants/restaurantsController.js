/*jshint camelcase: false */
var restaurantsModel = require('./restaurantsModel.js');
var JsonResponseObj = require('../JsonResponseObject.js');
var JsonDataObj = require('../JsonDataObject.js');

module.exports = {
  getRestaurants : function (req, res) {
    var JsonResponseObject = new JsonResponseObj();
    console.log('getting restaurant ', req.params.id);
    var parameters = {
      restaurantId: req.params.id,
      userId: req.user.id,
      all: req.query.all
    };
    restaurantsModel.restaurant.get(parameters)
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
            restaurantDescription: data[i].restaurant_description,
            restaurantPhoneNumber: data[i].restaurant_phone_number,
            restaurantCategory: data[i].restaurant_category,
            restaurantPictureUrl: data[i].restaurant_picture_url,
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
    var params = req.body;
    params.restaurant_owner_id = req.user.id;
    restaurantsModel.restaurant.post(params)
      .then(function (data) {
        console.log('data sent back is ', data);
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
  },

  //tables
  getTables : function (req, res) {
    var restaurantId = req.query.rid;
    console.log(restaurantId);
    var JsonResponseObject = new JsonResponseObj();
    restaurantsModel.tables.get(restaurantId)
      .then(function (data) {
        for (var i = 0; i < data.length; i++) {
          var JsonDataObject = new JsonDataObj();
          JsonDataObject.type = 'tables';
          JsonDataObject.id = data[i].id;
          JsonDataObject.attributes = {
            restaurantId: data[i].restaurant_id,
            tableNumber: data[i].table_number,
            seats: data[i].seats,
            available: !!data[i].available
          };
          JsonResponseObject.data.push(JsonDataObject);
        }
        res.status(200);
        res.send(JsonResponseObject);
      });
  }
};
