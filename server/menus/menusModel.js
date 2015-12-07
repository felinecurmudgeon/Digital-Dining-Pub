/*jshint -W079 */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

  module.exports = {
    menuCategory: {
      getAll: function () {
        return new Promise (function (resolve, reject) {
          db.con.query('SELECT * FROM menu_categories', function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      },
      get: function (restaurantId) {
      //retrieves whole menu_categories for a given restaurantId
        return new Promise(function (resolve, reject) {
          db.con.query('SELECT id as menuCategoryId, category_name as menuCategoryName \
                        FROM menu_categories \
                        WHERE restaurant_id = ' + restaurantId, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      },
      post: function (menuCategoryItem) {
      /*creates a menu_category entry; expected paramters: restaurant_id, category_name*/
        return new Promise(function (resolve, reject) {
          db.con.query('INSERT into menu_categories set ?', menuCategoryItem, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      }
    },
    menuItem: {
      get: function (restaurantId) {
      //retrieves whole menu for a given restaurantId
        return new Promise(function (resolve, reject) {
          db.con.query('SELECT m.id as menuId, c.category_name as menuCategoryName, \
                          m.title, m.description, m.price \
                        FROM menu_items m \
                        INNER JOIN menu_categories c ON m.menu_category_id = c.id \
                        WHERE m.restaurant_id = ' + restaurantId, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      },
      post: function (menuItem) {
      /*creates a menu item; expected paramters: restaurant_id, title, description, price
      and optional menu_category_id*/
        return new Promise(function (resolve, reject) {
          db.con.query('INSERT into menu_items set ?', menuItem, function (err, data) {
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
