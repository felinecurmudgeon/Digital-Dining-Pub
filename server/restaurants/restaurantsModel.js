/*jshint -W079 */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

module.exports = {
  restaurant: {
    get: function (parameters) {
      return new Promise(function (resolve, reject) {
        var query = '';
        if (parameters.restaurantId) {
          query = 'SELECT * FROM restaurants WHERE id = ' + parameters.restaurantId;
        } else if (parameters.all === 'false') {
          query = 'SELECT * FROM restaurants WHERE restaurant_owner_id = ' + parameters.userId;
        } else {
          query = 'SELECT * FROM restaurants';
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
      db.con.query('UPDATE restaurants SET ? WHERE id= ?', [updatedRestaurant, id], function (err) {
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
  },
  tables: {
    get: function (restaurantId) {
      return new Promise(function (resolve, reject) {
        db.con.query('SELECT * FROM tables WHERE restaurant_id = ' + restaurantId, function (err, data) {
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
