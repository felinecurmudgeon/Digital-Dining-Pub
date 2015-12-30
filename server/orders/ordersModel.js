/*jshint -W079 */
/*jshint camelcase: false */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

module.exports = {
  order: {
    post: function (parameters) {
    /*writes the orders in the DB for the given party
    expected parameters: party_id, user_id, and menu_items (an array of menu_items with menu_item_id and quantity) */
      return new Promise(function (resolve, reject) {
        var ordered_at = new Date().toMysqlFormat();
        var menu_items = parameters.menu_items.map(function (el) {
          return [parameters.party_id, el.menu_item_id, el.quantity, parameters.user_id, ordered_at];
        });
        db.con.query('INSERT INTO menu_items_ordered (party_id, menu_item_id, quantity, user_id, ordered_at) VALUES ?', [menu_items], function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    get: function (partyId) {
      return new Promise(function (resolve, reject) {
        db.con.query('SELECT mio.id, mio.party_id, mio.menu_item_id, mio.quantity, mio.total_paid, mio.ordered_at, mio.served_at, mio.paid_at, mio.canceled_at, p.restaurant_id, mi.price, mi.title, mi.description, mi.menu_category_id FROM menu_items_ordered mio INNER JOIN parties p ON mio.party_id = p.id INNER JOIN menu_items mi ON mi.id = mio.menu_item_id WHERE p.id = ?', partyId, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    put: function (id, parameters) {
      return new Promise(function (resolve, reject) {
        db.con.query('UPDATE menu_items_ordered SET ? WHERE id = ?', [parameters, id], function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    delete: function (id) {
      return new Promise(function (resolve, reject) {
        db.con.query('DELETE FROM menu_items_ordered WHERE id = ?', id, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    put: function (updatedItem, itemId) {
      return new Promise(function (resolve, reject) {
        db.con.query('UPDATE menu_items_ordered SET ? WHERE id = ?', [updatedItem, itemId], function (err) {
          if (err) {
            reject (err);
          } else {
            console.log('successful update: ', updatedItem);
            console.log('with ID: ', itemId);
            resolve(updatedItem);
          }
        });
      });
    },
    batchPut: function (updatedItems) {
      return new Promise(function (resolve, reject) {
        db.con.beginTransaction(function (err) {
          if (err) {
            return db.con.rollback(function () {
              reject(err);
            });
          }
          var putPromises = [];
          for (var i = 0; i < updatedItems.length; i++) {
            putPromises.push(module.exports.order.put(updatedItems[i], updatedItems[i].id));
          }

          return Promise.all(putPromises).then(function (updatedIds) {
            db.con.commit(function (err) {
              if (err) {
                return db.con.rollback(function () {
                  reject(err);
                });
              }
              resolve(updatedIds);
            });
          })
          .catch(function (err) {
            return db.con.rollback(function () {
              reject(err);
            });
          });
        });
      });
    }
  }
};
