var menusModel = require('./menusModel.js');

module.exports = {

  //menu categories
  getMenuCategories : function (req, res) {
    console.log('getting menu categories');
    menusModel.menuCategory.get()
      .then(function (menuCats) {
        res.status(200);
        res.send(menuCats);
      });
  },

  createMenuCategories : function (req, res) {
    console.log('creating menu category');
     menusModel.menuCategory.post(req.body)
      .then(function (menuCats) {
        res.status(201);
        res.send(menuCats);
      });
  },

  ///menu items
  getMenuItems : function (req, res) {
    console.log('getting menu');
    menusModel.menuItems.get(req.params.rid)
      .then(function (menuItems) {
        res.status(200);
        res.send(menuItems);
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
