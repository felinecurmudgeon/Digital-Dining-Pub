/*jshint -W079 */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

module.exports = {
  restaurant: {
    get: function (restaurantId) {
      return new Promise( function (resolve, reject) {
        db.con.query('SELECT * FROM restaurants \
                      WHERE id = ' + restaurantId, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    post: function (restaurant) {
    /*creates a new restaurant; expected parameters: restaurant_name, restaurant_owner_id,
    restaurant_adress, restaurant_city, restaurant_state, restaurant_zip_code,
    and optional opening_hour_monday, closing_hour_monday, etc that default to 8am and 11pm*/
      return new Promise(function (resolve, reject) {
        db.con.query('INSERT into restaurants set ?', restaurant, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  }
};

