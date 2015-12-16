var usersController = require('./users/usersController');
var restaurantUsersController = require('./users/restaurantUsersController');
var restaurantsController = require('./restaurants/restaurantsController');
var menusController = require('./menus/menusController');
var partiesController = require('./parties/partiesController');
var ordersController = require('./orders/ordersController');
var authController = require('./auth/authController');
var chargesController = require('./charges/chargesController');

module.exports = function (router) {
  router.get('/api/users', usersController.getAllUsers);
  router.get('/api/users/:id', usersController.getUser);
  router.post('/api/users', usersController.createUser);
  router.put('/api/users/:id', usersController.updateUser);

  router.post('/api/signin', authController.signin);
  router.post('/api/signup', authController.signup);
  router.get('/api/auth/facebook', authController.facebookLogin());
  router.get('/api/auth/callback', authController.facebookCallback);

  router.get('/api/restaurantusers', restaurantUsersController.getUser);
  router.get('/api/restaurantusers/:id', restaurantUsersController.getUser);
  router.post('/api/restaurantusers', restaurantUsersController.createUser);

  router.get('/api/restaurants', restaurantsController.getRestaurants);
  router.get('/api/restaurants/:id', restaurantsController.getRestaurants);
  router.post('/api/restaurants', restaurantsController.createRestaurant);
  router.put('/api/restaurants/:id', restaurantsController.updateRestaurant);
  router.delete('/api/restaurants/:id', restaurantsController.deleteRestaurant);

  router.get('/api/menuCategories', menusController.getMenuCategories);
  router.post('/api/menuCategories', menusController.createMenuCategories);

  router.get('/api/menuItems', menusController.getMenuItems);
  router.post('/api/menuItems', menusController.createMenuItems);
  router.put('/api/menuItems/:id', menusController.updateMenuItems);
  router.delete('/api/menuItems/:id', menusController.deleteMenuItems);

  router.post('/api/charges', chargesController.chargeCard);

  router.post('/api/parties', partiesController.checkInAndCreateParty);
  router.put('/api/parties/:id', partiesController.editParty);
  router.get('/api/parties', partiesController.get);
  router.get('/api/parties/:id', partiesController.get);

  router.get('/api/parties/:pid/menuitems', ordersController.getItemsOrdered);
  router.post('/api/parties/:pid/menuitems', ordersController.postItemsOrdered);
  router.delete('/api/parties/:pid/menuitems/:mid', ordersController.deleteItemsOrdered);
};
