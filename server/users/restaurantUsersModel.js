/*jshint -W079 */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');
var JsonResponseObj = require('../JsonResponseObject.js');
var JsonResponseObject = new JsonResponseObj();
var JsonDataObj = require('../JsonDataObject.js');
var JsonDataObject = new JsonDataObj();

module.exports = {
  restaurantUser: {
    get: function (id) {
      return new Promise( function (resolve, reject) {
        var query = '';

        if (id) {
          query = 'SELECT * FROM restaurant_users \
                      WHERE id = ' + id;
        } else {
          query = 'SELECT * FROM restaurant_users';
        }

        db.con.query(query, function (err, data) {
          if (err) {
            reject(err);
          } else {
            for (var i = 0; i < data.length; i++) {
              JsonDataObject.type = 'restaurantUsers';
              JsonDataObject.id = data[i].id;
              JsonDataObject.attributes = {
                username: data[i].username,
                password: data[i].password
              };
              JsonResponseObject.data.push(JsonDataObject);
            }

            resolve(JsonResponseObject);
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
            restaurantUser.id = data.insertId;
            resolve(restaurantUser);
          }
        });
      });
    }
  }
};
