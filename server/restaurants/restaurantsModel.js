/*jshint -W079 */
/*jshint camelcase: false */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');
var JsonResponseObj = require('../JsonResponseObject.js');
var JsonResponseObject = new JsonResponseObj();
var JsonDataObj = require('../JsonDataObject.js');
var JsonDataObject = new JsonDataObj();

module.exports = {
  restaurant: {
    get: function (restaurantId) {
      return new Promise(function (resolve, reject) {
        var query = '';
        if (restaurantId) {
          query = 'SELECT * FROM restaurants WHERE id = ' + restaurantId;
        } else {
          query = 'SELECT * FROM restaurants';
        }
        db.con.query(query, function (err, data) {
          if (err) {
            reject(err);
          } else {
            for (var i = 0; i < data.length; i++) {
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
            resolve(JsonResponseObject);
          }
        });
      });
    },
    post: function (restaurant) {
      return new Promise(function (resolve, reject) {
        db.con.query('INSERT into restaurants SET ?', restaurant, function (err, data) {
          if (err) {
            reject(err);
          } else {
            restaurant.id = data.insertId;
            resolve(restaurant);
          }
        });
      });
    },
   put: function (updatedRestaurant, id) {
    return new Promise(function (resolve, reject) {
      db.con.query('UPDATE restaurants SET ? WHERE id=' + id, updatedRestaurant, function (err, data) {
        if (err) {
          reject (err);
        } else {
          resolve(updatedRestaurant);
        }
      });
    });
   },
   delete: function (id) {
    return new Promise(function (resolve, reject) {
      db.con.query('DELETE FROM restaurants WHERE id=' + id, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(id);
        }
      });
    });
   }
  }
};

