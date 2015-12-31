/*jshint -W079 */
var db = require('../server/sql-db/index');
var Promise = require('bluebird');
require('../server/utils');

var deleteAllDataFromTable = function (table) {
  return new Promise( function (resolve, reject) {
    db.con.query('DELETE FROM ??', table, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

var getAllDataFromTable = function (table) {
  return new Promise(function (resolve, reject){
    db.con.query('SELECT * FROM '+ table, function (err, data) {
      if (err){
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

var insertData = function (table, object) {
  return new Promise( function (resolve, reject) {
    db.con.query('INSERT INTO ?? SET ?', [table, object], function (err, data) {
      if (err) {
        reject(err);
      } else {
        object.id = data.insertId;
        resolve(object);
      }
    });
  });
};

var insertOrUpdateUser = function (table, user) { //only for unique key constraint username
  return new Promise( function (resolve, reject) {
    db.con.query('SELECT * FROM ?? WHERE username = ?', [table, user.username], function (err, data) {
      if (err) {
        reject(err);
      } else {
        if (data.length) {
          db.con.query('UPDATE ?? SET ? WHERE id = ?', [table, user, data[0].id], function (err) {
            if (err) {
              reject(err);
            } else {
              user.id = data[0].id;
              resolve(user);
            }
          });
        } else {
          db.con.query('INSERT INTO ?? SET ?', [table, user], function (err, data) {
            if (err) {
              reject(err);
            } else {
              user.id = data.insertId;
              resolve(user);
            }
          });
        }
      }
    });
  });
};

var restaurantOwners = [
  {username: 'EmilioPizzaiolo',
  password: 'pwd',
  is_restaurant_user: true},
  
  {username: 'Sam',
  password: 'qwerty',
  is_restaurant_user: true},
  
  {username: 'Germaine',
  password: 'france98',
  is_restaurant_user: true},
  
  {username: 'Hans',
  password: '123456',
  is_restaurant_user: true},

  {username: 'Joe Edwards',
  password: 'bluehill',
  is_restaurant_user: true}
];

var users = [
  {username: 'toto',
  password: 'pwd'},
  
  {username: 'emilio',
  password: 'qwerty'},
  
  {username: 'ZinedineZidane',
  password: 'france98'},
  
  {username: 'tobias',
  password: '123456'}
];

var restaurants = [
  {restaurant_name: 'Pizza Pino',
  restaurant_address: '944 Market Street',
  restaurant_city: 'San Francisco',
  restaurant_state: 'California',
  restaurant_zip_code: 94102},

  {restaurant_name: 'Happy Burgers',
  restaurant_address: '234 Mission Street',
  restaurant_city: 'San Francisco',
  restaurant_state: 'California',
  restaurant_zip_code: 94105},
  
  {restaurant_name: 'Chez Denise',
  restaurant_address: '9 avenue de l\'indépendance américaine',
  restaurant_city: 'San Francisco',
  restaurant_state: 'California',
  restaurant_zip_code: 94122,
  restaurant_picture_url: 'http://www.24-7.com/wp-content/uploads/2015/01/10uk139.jpg',
  opening_hour_monday:'11:00:00',
  closing_hour_monday: '22:30:00',
  opening_hour_tuesday:'11:00:00',
  closing_hour_tuesday: '22:30:00',
  opening_hour_wednesday: '00:00:00',
  closing_hour_wednesday: '00:00:00',
  opening_hour_thursday: '11:00:00',
  closing_hour_thursday: '22:30:00',
  opening_hour_friday: '11:00:00',
  closing_hour_friday: '25:00:00',
  opening_hour_saturday: '11:00:00',
  closing_hour_saturday: '25:00:00',
  opening_hour_sunday: '00:00:00',
  closing_hour_sunday: '00:00:00'},
  
  {restaurant_name: 'Lolinda',
  restaurant_address: '2518 Mission St',
  restaurant_city: 'San Francisco',
  restaurant_state: 'California',
  restaurant_zip_code: 94110},

  {restaurant_name: 'Blueberry Hill',
  restaurant_address: '6504 Delmar Blvd',
  restaurant_city: 'Saint Louis',
  restaurant_state: 'Missouri',
  restaurant_zip_code: 63130,
  restaurant_picture_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Blueberry_Hill_patio.jpg/220px-Blueberry_Hill_patio.jpg',
  opening_hour_monday:'09:00:00',
  closing_hour_monday: '22:30:00',
  opening_hour_tuesday:'09:00:00',
  closing_hour_tuesday: '22:30:00',
  opening_hour_wednesday: '09:00:00',
  closing_hour_wednesday: '22:30:00',
  opening_hour_thursday: '09:00:00',
  closing_hour_thursday: '22:30:00',
  opening_hour_friday: '09:00:00',
  closing_hour_friday: '26:00:00',
  opening_hour_saturday: '09:00:00',
  closing_hour_saturday: '26:00:00',
  opening_hour_sunday: '09:00:00',
  closing_hour_sunday: '17:00:00'}
];

var tables = [
  [{table_number: 1, seats: 4},
  {table_number: 2, seats: 4},
  {table_number: 3, seats: 4},
  {table_number: 4, seats: 4}],

  [{table_number: 1, seats: 4},
  {table_number: 2, seats: 6},
  {table_number: 3, seats: 4},
  {table_number: 4, seats: 4},
  {table_number: 5, seats: 6},
  {table_number: 6, seats: 6}],

  [{table_number: 1, seats: 4},
  {table_number: 2, seats: 4},
  {table_number: 3, seats: 4},
  {table_number: 4, seats: 4}],

  [{table_number: 1, seats: 2},
  {table_number: 2, seats: 4},
  {table_number: 3, seats: 4},
  {table_number: 4, seats: 2}],

  [{table_number: 1, seats: 2},
  {table_number: 2, seats: 4},
  {table_number: 3, seats: 4},
  {table_number: 4, seats: 2},
  {table_number: 5, seats: 6},
  {table_number: 6, seats: 8},
  {table_number: 7, seats: 4}]
];

var menuCategories = [ //each subArray will be affected to the corresponding restaurant above
  [{category_name: 'Appetizer'},
  {category_name: 'Drinks'}],
  
  [{category_name: 'Soups'},
  {category_name: 'Desserts'}],
  
  [{category_name: 'Appetizer'},
  {category_name: 'Drinks'}],
  
  [{category_name: 'Main Courses'},
  {category_name: 'Desserts'}],

  [{category_name: 'Appetizers'},
  {category_name: 'Salads'},
  {category_name: 'Soups'},
  {category_name: 'Hamburgers'},
  {category_name: 'Specialties'},
  {category_name: 'Desserts'}]
];

var menuItems = [ /*each subArray will be affected to the corresponding restaurant above
                and each nested subArray inside a subArray will be affected to the corresponding menu_category above*/
  [[{title: 'Prosciutto', 
  description: 'ham and bread with small sliced tomatoes', 
  price: 5.95}], 
  [{title: 'Birra Moretti', 
  description: 'Lager beer', 
  price: 7.65}]],
  
  [[],
  [{title: 'Cheesecake', 
  description: 'low fat and organic', 
  price: 6}]],

  [[{title: 'Onion Soup', 
  description: '100% home-made (onions grow in our backyard)', 
  price: 8.85}],
  []],
  
  [[{title: 'Angus Steak', 
  description: 'from Wisconsin', 
  price: 12}],
  []],

  [[{title: 'Zucchini Sticks', 
  description: 'Battered and served with a marinara sauce dip', 
  price: 5.25,
  menu_item_picture_url: 'http://www.mygourmetconnection.com/recipes/vegetables/img/crunchy-oven-fried-zucchini-sticks.jpg'},
  {title: 'Tater Tots', 
  description: 'As good as you remember!', 
  price: 3.25,
  menu_item_picture_url: 'http://www.doghaus.com/dh-uploads/menu-detail/haus%20sides/Dog-Haus_Menu-Detail-tater-tots.jpg'},
  {title: 'Toasted Ravioli', 
  description: 'A St. Louis classic - toasted beef ravioli with marinara sauce', 
  price: 4.25,
  menu_item_picture_url: 'http://mfoodinfo.com/wp-content/uploads/2015/09/fried-ravioli.jpg'}],
  [{title: 'House Salad', 
  description: 'Seasonal mix of salad greens, carrots, cucumbers, radishes, and red onions.', 
  price: 6.50,
  menu_item_picture_url: 'http://kabulhouse.com/udata/prods/597_l'},
  {title: 'Garden Salad', 
  description: 'Our House Salad with celery, green peppers and provel cheese.', 
  price: 7.25,
  menu_item_picture_url: 'http://www.spur.co.za/nutrition/assets/product/Sides_Side_Garden_Salad_a.jpg'}],
  [{title: 'Vegan Vegetable', 
  description: 'Carrots, onions, celery, broccoli, corn, peas, asparagus, green beans and tomatoes.', 
  price: 3.75,
  menu_item_picture_url: 'http://www.manjulaskitchen.com/blog/wp-content/uploads/vegetable_soup.jpg'},
  {title: 'French Onion', 
  description: 'Special decades-old house recipe.  Served with French bread and butter.', 
  price: 4.25,
  menu_item_picture_url: 'http://foodnetwork.sndimg.com/content/dam/images/food/fullset/2006/6/5/0/pa0709_french_onion_soup_2.jpg'}],
  [{title: '5 oz. Hamburger', 
  description: 'Smaller version of our award-winning hamburger.', 
  price: 5.95,
  menu_item_picture_url: 'http://blog.williams-sonoma.com/wp-content/uploads/2013/08/WS_GrillMaster_Howto_Cheeseburger_143.jpg'},
  {title: 'Hickory Burger', 
  description: '7 oz. all-natural hickory-seasoned hamburger with hickory sauce.', 
  price: 6.70,
  menu_item_picture_url: 'http://www.foxnews.com/recipe/sites/foxnews.com.recipe/files/styles/slideshow/public/NEWOldHickory660.jpg'}],
  [{title: 'Fish & Chips', 
  description: 'Beer battered Cod served with cole slaw, tarter sauce and French fries.', 
  price: 8.50,
  menu_item_picture_url: 'http://aboutentertainmentinfo.com/wp-content/uploads/2015/04/fish-with-chips-best-food.jpg'},
  {title: 'Chili Mac', 
  description: 'Hearty portion of macaroni topped with our award-winning spicy chili.', 
  price: 5.95,
  menu_item_picture_url: 'http://thrivingvegetarian.com/blog/wp-content/uploads/chili-mac1.jpg'}],
  [{title: 'Scrumptious Bread Pudding', 
  description: 'Served a la mode', 
  price: 4.95,
  menu_item_picture_url: 'http://cleditorial.s3.amazonaws.com/article/cruising101/qa/bread-pudding/norwegian-bread-pudding-770.jpg'},
  {title: 'Gooey Butter Cake', 
  description: 'A St.Louis classic.', 
  price: 4.50,
  menu_item_picture_url: 'http://www.vapealiciousjuice.com/assets/images/stlgooey.jpg'}]]
];

module.exports = {
  createCompleteRestaurantsInDB: function (){
    //TODO: either run test in gulp or make this function actually create dummy data
    console.log("creating dummy complete restaurants");
    return Promise.all(restaurantOwners.map(function (restaurantUser, index) {
      return insertOrUpdateUser('users', restaurantUser)
        .then(function (createdRestaurantUser) {
          restaurants[index].restaurant_owner_id = createdRestaurantUser.id
          return insertData('restaurants', restaurants[index]);
        })
        .then(function (restaurantCreated) {
          return Promise.all(tables[index].map(function (table) {
            table.restaurant_id = restaurantCreated.id;
            return insertData('tables', table);
          }));
        })
        .then(function (tablesCreated) {
          return Promise.all(menuCategories[index].map(function (menuCategory) {
            menuCategory.restaurant_id = tablesCreated[0].restaurant_id;
            return insertData('menu_categories', menuCategory);
          }));
        })
        .then(function (menuCategoriesCreated) {
          return Promise.all(menuItems[index].map(function (menuItemsForRestaurant, categoryIndex) {
            return Promise.all(menuItemsForRestaurant.map(function (menuItem) {
              menuItem.restaurant_id = menuCategoriesCreated[categoryIndex].restaurant_id;
              menuItem.menu_category_id = menuCategoriesCreated[categoryIndex].id;
              return insertData('menu_items', menuItem);
            }));
          }));
        })
        .then(function () {
          console.log('"' + restaurants[index].restaurant_name + '" restaurant created with restaurant_owner, tables and menus');
        });
    }));
  },

  createUsersInDB: function (){
    console.log("creating dummy users");
    return Promise.all(users.map(function (user, index) {
      return insertOrUpdateUser('users', user)
        .then(function() {
          console.log('"' + user.username + '" user created');
        })
    }));
  },

  flushAllData: function (){
    return deleteAllDataFromTable('payments')
      .then(function() {
        deleteAllDataFromTable('party_participants');
      })
      .then(function() {
        deleteAllDataFromTable('menu_items_ordered');
      })
      .then(function() {
        deleteAllDataFromTable('parties');
      })
      .then(function() {
        deleteAllDataFromTable('payment_info');
      })
      .then(function() {
        deleteAllDataFromTable('menu_items');
      })
      .then(function() {
        deleteAllDataFromTable('menu_categories');
      })
      .then(function() {
        deleteAllDataFromTable('tables');
      })
      .then(function() {
        deleteAllDataFromTable('restaurant_employees');
      })
      .then(function() {
        deleteAllDataFromTable('restaurants');
      })
      .then(function() {
        deleteAllDataFromTable('users');
      })
      .then(function() {
        console.log('DB emptied!');
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  insertPartyandOrder: function () {
      var testDataIds = {};
      testDataIds.userIds = [];
      testDataIds.restIds = [];
      testDataIds.tableIds = [];
      testDataIds.partyIds = [];

      //sql select query for user_ids, rest_ids and table_ids 
     return getAllDataFromTable('users')
      .then(function (users) {
        users.forEach(function (user) {
          testDataIds.userIds.push(user.id);
        })
        return getAllDataFromTable('restaurants')
      })
      .then(function (restaurants) {
        restaurants.forEach(function (restaurant) {
          testDataIds.restIds.push(restaurant.id);
        })
        return getAllDataFromTable('tables')
      })
      .then(function (tables) {
        return tables.forEach(function (table) {
          testDataIds.tableIds.push({
            "id": table.id,
            "rid": table.restaurant_id
          })
        })
      })
      //insert into party and party_participants 
      .then(function () {
        return Promise.all(testDataIds.tableIds.map(function (tableIds, index) {
          var nameGenerator = require('../server/parties/nameGenerator');
          var seated = Math.random() > 0.5;
          var partyObj = {
            "table_id": (seated ? testDataIds.tableIds[index].id : null),
            "restaurant_id": testDataIds.tableIds[index].rid,
            "party_size": Math.ceil(4 * Math.random()),
            "party_name": nameGenerator(),
            "checkedin_at": new Date().toMysqlFormat(),
            "seated_at": (seated ? new Date().toMysqlFormat() : "0000-00-00 00:00:00")
          }
          return insertData('parties', partyObj);
        }))

      })
      .then(function (parties) {
        return Promise.all(parties.map(function (party, index) {
          testDataIds.partyIds.push(party.id);
          var participantsObj = {
            "user_id": testDataIds.userIds[Math.floor(testDataIds.userIds.length * Math.random())],
            "party_id": party.id
          }
          return insertData('party_participants', participantsObj)
        }))
      })
      .then(function (partyParticipants){
        //sql select query for menu_item_ids
        return Promise.all(partyParticipants.map(function (participant, index) {
            return getAllDataFromTable('menu_items')
              .then(function (menuItems) {
                var menuItemOrderedObj = {
                  "party_id": participant.party_id,
                  "user_id": participant.user_id,
                  "menu_item_id": menuItems[Math.floor(menuItems.length * Math.random())].id,
                  "ordered_at": new Date().toMysqlFormat()
                };
                var menuItemOrderedObj2 = {
                  "party_id": participant.party_id,
                  "user_id": participant.user_id,
                  "menu_item_id": menuItems[Math.floor(menuItems.length * Math.random())].id,
                  "ordered_at": new Date().toMysqlFormat()
                };
                var menuItemOrderedObj3 = {
                  "party_id": participant.party_id,
                  "user_id": participant.user_id,
                  "menu_item_id": menuItems[Math.floor(menuItems.length * Math.random())].id,
                  "ordered_at": new Date().toMysqlFormat()
                };
                insertData('menu_items_ordered', menuItemOrderedObj);
                insertData('menu_items_ordered', menuItemOrderedObj2);
               //insert into menu_items_ordered 
               return insertData('menu_items_ordered', menuItemOrderedObj2);
              })
          }))
        })
      .catch(function (err) {
        console.log(err);
      })
  },

  emptyAndRepopulateDB: function () {
    return module.exports.flushAllData()
      .then(function() {
        return module.exports.createCompleteRestaurantsInDB();
      })
      .then(function() {
        return module.exports.createUsersInDB();
      })
      .then(function (){
        return module.exports.insertPartyandOrder();
      })    
  },

  endDBConnexion: function () {
    db.con.end();
  }
};
