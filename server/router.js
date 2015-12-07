var usersController = require('./users/usersController');
var restaurantUsersController = require('./users/restaurantUsersController');
var restaurantsController = require('./restaurants/restaurantsController');
var menusController = require('./menus/menusController');

module.exports = function (router) {
  router.get('/api/users', usersController.getAllUsers);
  router.get('/api/users/:id', usersController.getUser);
  router.post('/api/users', usersController.createUser);
  router.put('/api/users/:id', usersController.updateUser);

  router.get('/api/restaurantusers', restaurantUsersController.getUser);
  router.get('/api/restaurantusers/:id', restaurantUsersController.getUser);
  router.post('/api/restaurantusers', restaurantUsersController.createUser);
  router.put('/api/restaurantusers/:id', restaurantUsersController.updateUser);

  router.get('/api/restaurants', restaurantsController.getAllRestaurants);
  router.get('/api/restaurants/:id', restaurantsController.getRestaurant);
  router.post('/api/restaurants', restaurantsController.createRestaurant);
  router.put('/api/restaurants/:id', restaurantsController.updateRestaurant);
  router.delete('/api/restaurants/:id', restaurantsController.deleteRestaurant);

  router.get('/api/menus', menusController.getAllMenus);
  router.get('/api/menus/:id', menusController.getMenu);
  router.post('/api/menus', menusController.createMenu);
  router.put('/api/menus/:id', menusController.updateMenu);
  router.delete('/api/menus/:id', menusController.deleteMenu);

};
