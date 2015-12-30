/*jshint -W079 */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

module.exports = {
  user: {
    get: function (id, custonly) {
      return new Promise( function (resolve, reject) {
        var query;
        if (id) {
          query = 'SELECT * FROM users \
                      WHERE id = ' + id;
        } else if (custonly === 'true') {
            query = 'SELECT * FROM users WHERE is_restaurant_user = 0';
        } else {
            query = 'SELECT * FROM users';
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
    //getByUsername is for non-FB auth.  It does not return users with Facebook IDs in case there is a conflict
    getByUsername: function (username) {
      return new Promise( function (resolve, reject) {
        db.con.query("SELECT * FROM users \
                                WHERE username = ? AND facebook_id = 'null'", username, function (err, data) {
          if (err) {
            console.log('user not found');
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    getByFBID: function (fbid) {
      return new Promise( function (resolve, reject) {
        db.con.query('SELECT * FROM users \
                                 WHERE facebook_id = ?', fbid, function (err, data) {
        if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    post: function (user) {
      return new Promise(function (resolve, reject) {
        db.con.query('INSERT into users set ?', user, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    put: function (userId, user) {
      return new Promise(function (resolve, reject) {
        db.con.query('UPDATE users SET ? WHERE id = ?', [user, userId], function (err, data) {
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
