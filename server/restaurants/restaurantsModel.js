/*jshint -W079 */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

module.exports = {
  restaurant: {
    get: function (restaurantId) {
<<<<<<< HEAD
      return new Promise(function (resolve, reject) {
=======
      return new Promise( function (resolve, reject) {
>>>>>>> Lots of styling.  Added general scheme for auth -- user information is sent from client to server which reads/writes to DB.  App goes to login page first and then go the 'main' page on successful login.  JWT is returned from the server but not currently stored.  Need to store the JWT on the client and add it to all outgoing AJAX requests.  Server needs to parse the JWT and add it to the req
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
      db.con.query('UPDATE restaurants SET ? WHERE id= ?' + [updatedRestaurant, id], function (err) {
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

