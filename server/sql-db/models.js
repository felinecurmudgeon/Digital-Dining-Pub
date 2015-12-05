var db = require('./index');
var Promise = require('bluebird');

module.exports = {
  restaurantUser: {
    get: function (username) {
      return new Promise( function (resolve, reject) {
        db.con.query("SELECT * FROM restaurant_users \
                      WHERE username = '" + username + "'", function (err, data) {
          if(err){
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    post: function(restaurantUser) {
    /*creates a new restaurant_user; expected parameters: username, password,
    and optional restaurant_id*/
      return new Promise(function (resolve, reject) {
        db.con.query("INSERT into restaurant_users set ?", restaurantUser, function (err, data) {
          if(err){
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  },

  restaurant: {
    get: function (restaurantId) {
      return new Promise( function (resolve, reject) {
        db.con.query("SELECT * FROM restaurants \
                      WHERE id = " + restaurantId, function (err, data) {
          if(err){
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    post: function(restaurant) {
    /*creates a new restaurant; expected parameters: restaurant_name, restaurant_owner_id,
    and optional opening_hour_monday, closing_hour_monday, etc that default to 8am and 11pm*/
      return new Promise(function (resolve, reject) {
        db.con.query("INSERT into restaurants set ?", restaurant, function (err, data) {
          if(err){
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  },

  menuCategory: {
    get: function (restaurantId) {
    //retrieves whole menu_categories for a given restaurantId
      return new Promise(function (resolve, reject) {
        db.con.query("SELECT id as menuCategoryId, category_name as menuCategoryName \
                      FROM menu_categories \
                      WHERE restaurant_id = " + restaurantId, function (err, data) {
          if(err){
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
        db.con.query("INSERT into menu_categories set ?", menuCategoryItem, function (err, data) {
          if(err){
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
        db.con.query("SELECT m.id as menuId, c.category_name as menuCategoryName, \
                        m.title, m.description, m.price \
                      FROM menu_items m \
                      INNER JOIN menu_categories c ON m.menu_category_id = c.id \
                      WHERE m.restaurant_id = " + restaurantId, function (err, data) {
          if(err){
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
        db.con.query("INSERT into menu_items set ?", menuItem, function (err, data) {
          if(err){
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  }
};

