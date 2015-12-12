/*jshint camelcase: false */
var menusModel = require('./menusModel.js');
var JsonResponseObj = require('../JsonResponseObject.js');
var JsonDataObj = require('../JsonDataObject.js');

module.exports = {
  //menu categories
  getMenuCategories : function (req, res) {
    console.log('getting menu categories');
    var JsonResponseObject = new JsonResponseObj();
    menusModel.menuCategory.get()
      .then(function (menuCats) {
        for (var i = 0; i < menuCats.length; i++) {
          var JsonDataObject = new JsonDataObj();
          JsonDataObject.type = 'menuCategory';
          JsonDataObject.id = menuCats[i].id;
          JsonDataObject.attributes = {
            restaurant_id : menuCats[i].restaurant_id,
            category_name : menuCats[i].category_name
          };
          JsonResponseObject.data.push(JsonDataObject);
        }
        res.status(200);
        res.send(JsonResponseObject);
      });
  },

  createMenuCategories : function (req, res) {
    console.log('creating menu category');
     menusModel.menuCategory.post(req.body)
      .then(function (menuCat) {
        res.status(201);
        res.send(menuCat);
      });
  },

  ///menu items
  getMenuItems : function (req, res) {
    console.log('getting menu');
    var JsonResponseObject = new JsonResponseObj();
    menusModel.menuItems.get(req.query.rid)
      .then(function (menuItems) {
        for (var i = 0; i < menuItems.length; i++) {
          console.log(menuItems[i]);
          var JsonDataObject = new JsonDataObj();
          var JsonDataObjectIncluded = new JsonDataObj();
          JsonDataObject.type = 'menuItem';
          JsonDataObject.id = menuItems[i].id;
          JsonDataObject.attributes = {
            restaurantId : menuItems[i].restaurant_id,
            title : menuItems[i].title,
            description : menuItems[i].description,
            price : menuItems[i].price,
            menuCategoryId : menuItems[i].menu_category_id
          };
          JsonDataObjectIncluded.type = 'menuCategory';
          JsonDataObjectIncluded.id = menuItems[i].menu_category_id;
          JsonDataObjectIncluded.attributes = {
            categoryName: menuItems[i].category_name
          };

          JsonResponseObject.data.push(JsonDataObject);
          JsonResponseObject.included.push(JsonDataObjectIncluded);
        };
        res.status(200);
        res.send(JsonResponseObject);
      });
  },

  createMenuItems : function (req, res) {
    console.log('creating menu ');
     menusModel.menuItems.post(req.body)
      .then(function (createdItem) {
        res.status(201);
        res.send(createdItem);
      });
  },

  updateMenuItems : function (req, res) {
    console.log('updating menu ', req.params.id);
    menusModel.menuItems.put(req.body, req.params.id)
      .then(function (updatedItem) {
        res.status(201);
        res.send(updatedItem);
      });
  },

  deleteMenuItems : function (req, res) {
    console.log('delete menu ', req.params.id);
    menusModel.menuItems.delete(req.params.id)
     .then(function (deletedItemId) {
       res.status(204);
       res.send(deletedItemId);
     });
  }
};
