/*jshint -W079 */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

module.exports = {
  restaurantUser: {
    get: function (id) {
      return new Promise( function (resolve, reject) {
        var query = '';
        if (id) {
          query = "SELECT * FROM restaurant_users \
                      WHERE id = '" + id + "'";
        } else {
          query = 'SELECT * FROM restaurant_users';
        }

        db.con.query(query, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    post: function (restaurantUser) {
      return new Promise(function (resolve, reject) {
        db.con.query('INSERT into restaurant_users set ?', restaurantUser, function (err, data) {
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
