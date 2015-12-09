/*jshint -W079 */
/*jshint camelcase: false */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');
var JsonResponseObj = require('../JsonResponseObject.js');
var JsonDataObj = require('../JsonDataObject.js');

  module.exports = {
    menuCategory: {
      get: function () {
        return new Promise(function (resolve, reject) {
          var JsonResponseObject = new JsonResponseObj();
          db.con.query('SELECT * FROM menu_categories', function (err, data) {
            if (err) {
              reject(err);
            } else {
              for (var i = 0; i < data.length; i++) {
                var JsonDataObject = new JsonDataObj();
                JsonDataObject.type = 'menuCategory';
                JsonDataObject.id = data[i].id;
                JsonDataObject.attributes = {
                  restaurant_id : data[i].restaurant_id,
                  category_name : data[i].category_name
                };
                JsonResponseObject.data.push(JsonDataObject);
              }
              resolve(JsonResponseObject);
            }
          });
        });
      },
      post: function (menuCategoryItem) {
      /*creates a menu_category entry; expected paramters: restaurant_id, category_name*/
        return new Promise(function (resolve, reject) {
          console.log(menuCategoryItem);
          db.con.query('INSERT into menu_categories SET ?', menuCategoryItem, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      }
    },
    menuItems: {
      get: function (restaurantId) {
      //retrieves whole menu for a given restaurantId
        return new Promise(function (resolve, reject) {
          var JsonResponseObject = new JsonResponseObj();
          db.con.query('SELECT m.id as menuId, c.category_name as menuCategoryName, \
                          m.title, m.description, m.price \
                        FROM menu_items m \
                        INNER JOIN menu_categories c ON m.menu_category_id = c.id \
                        WHERE m.restaurant_id = ' + restaurantId, function (err, data) {
            if (err) {
              reject(err);
            } else {
              for (var i = 0; i < data.length; i++) {
                var JsonDataObject = new JsonDataObj();
                JsonDataObject.type = 'menuItem';
                JsonDataObject.id = data[i].id;
                JsonDataObject.attributes = {
                  restaurant_id : data[i].restaurant_id,
                  title : data[i].title,
                  description : data[i].description,
                  price : data[i].price,
                  menu_category_id : data[i].menu_category_id
                };
                JsonResponseObject.data.push(JsonDataObject);
              }
              resolve(JsonResponseObject);
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
      },
      put: function (updatedMenuItem, id) {
      return new Promise(function (resolve, reject) {
        db.con.query('UPDATE menu_items SET ? WHERE id=' + id, updatedMenuItem, function (err) {
          if (err) {
            reject (err);
          } else {
            resolve(updatedMenuItem);
          }
        });
      });
     },
     delete: function (id) {
      return new Promise(function (resolve, reject) {
        db.con.query('DELETE FROM menu_items WHERE id=' + id, function (err) {
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
