/*jshint -W079 */
/*jshint camelcase: false */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

  module.exports = {
    menuCategory: {
      put: function (updatedCategory, categoryId) {
        return new Promise(function (resolve, reject) {
          db.con.query('UPDATE menu_categories SET ? WHERE id = ?', [updatedCategory, categoryId], function (err) {
            if (err) {
              reject (err);
            } else {
              resolve(updatedCategory);
            }
          });
        });
      },
      get: function (rid) {
        return new Promise(function (resolve, reject) {
          var query = '';
          if (rid) {
            query = 'SELECT * FROM menu_categories WHERE restaurant_id=' + rid;
          } else {
            query = 'SELECT * FROM menu_categories';
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
      post: function (menuCategoryItem) {
      /*creates a menu_category entry; expected paramters: restaurant_id, category_name*/
        return new Promise(function (resolve, reject) {
          db.con.query('INSERT into menu_categories SET ?', menuCategoryItem, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      },
      //deleting a category also deletes all of the menu items associated with that category
      //The promise resolves as an array with the categoryID at index 0 and all the menu_item_ids at indices 1+
      delete: function (menuCategoryId) {
        return new Promise(function (resolve, reject) {
          db.con.beginTransaction(function (err) {
            if (err) {
              reject(err);
            }
            db.con.query('SELECT * FROM menu_items where menu_category_id = ?', menuCategoryId, function (err, data) {
              if (err) {
                return db.con.rollback(function () {
                  reject(err);
                });
              }
              var deletePromises = [];
              for (var i = 0; i < data.length; i++) {
                deletePromises.push(module.exports.menuItems.delete(data[i].id));
              }
              return Promise.all(deletePromises).then(function (deletedIds) {
                db.con.query('DELETE FROM menu_categories WHERE id = ?', menuCategoryId, function (err) {
                  if (err) {
                    return db.con.rollback(function () {
                      reject(err);
                    });
                  }
                  db.con.commit(function (err) {
                    if (err) {
                      return db.con.rollback(function () {
                        reject(err);
                      });
                    }
                    resolve([Number(menuCategoryId)].concat(deletedIds));
                  });
                });
              })
              .catch(function (err) {
                return db.con.rollback(function () {
                  reject(err);
                });
              });
            });
          });
        });
      }
    },
    menuItems: {
      get: function (restaurantId) {
      //retrieves whole menu for a given restaurantId
        return new Promise(function (resolve, reject) {
          db.con.query('SELECT m.created_at, m.updated_at, m.id, m.restaurant_id, m.menu_category_id, m.title, m.description, m.price, c.category_name FROM menu_items m INNER JOIN menu_categories c ON m.menu_category_id = c.id WHERE m.restaurant_id=' + restaurantId, function (err, data) {
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
      },
      put: function (updatedMenuItem, id) {
      return new Promise(function (resolve, reject) {
        db.con.query('UPDATE menu_items SET ? WHERE id = ?', [updatedMenuItem, id], function (err) {
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
        db.con.query('DELETE FROM menu_items WHERE id = ?', id, function (err) {
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
