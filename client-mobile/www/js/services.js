angular.module('digitalDining.services', [])

.factory('MenuFactory', function ($http) {
  var getMenuItems = function () {
    return $http({
      url: 'http://localhost:8000/api/menuitems',
      method: 'GET'
    });
  };
  var getSpecificMenu = function () {
    return $http({
      url: 'TBD',
      method: 'GET'
    });
  };
  var addMenuItemToOrder = function (item) {
    return $http({
      url: 'TBD',
      method: 'POST',
      data: {item: item}
    });
  };
  return {
    getMenuItems: getMenuItems,
    getSpecificMenu: getSpecificMenu,
    addMenuItemToOrder: addMenuItemToOrder
  };
})
.factory('HomeFactory', function ($http) {
  var getAllRestaurants = function () {
    return $http({
      url: 'http://localhost:8000/api/restaurants',
      method: 'GET'
    });
  };
  var focusedRestaurant = {};
  var focusRestaurant = function (rest) {
    focusedRestaurant = rest;
  };
  var getFocusedRestaurant = function () {
    return focusedRestaurant;
  };
  return {
    getAllRestaurants: getAllRestaurants,
    focusedRestaurant: focusedRestaurant,
    focusRestaurant: focusRestaurant,
    getFocusedRestaurant: getFocusedRestaurant
  };
})
.factory('CheckFactory', function ($http) {
  var getCheckItems = function () {
    return $http({
      url: 'TBD',
      method: 'GET'
    });
  };
  return {
    getCheckItems: getCheckItems
  };
})

.factory('RestaurantFactory', function ($http) {
  var getAllRestaurants = function () {
    return $http({
      url: 'TBD',
      method: 'GET'
    });
  };
  return {
    getAllRestaurants: getAllRestaurants
  };
})

.factory('PaymentFactory', function ($http) {
  var submitCharge = function (token) {
    return $http({
      url: 'http://localhost:8000/api/charges',
      method: 'POST',
      data: {'amount' : '1000', 'stripeToken' : token }
    });
  };
  return {
    submitCharge: submitCharge
  };
})

//adds the JWT to all outgoing http requests
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('digitaldining');
      if (jwt) {
        object.headers.authorization = 'Bearer ' + jwt;
      }
      return object;
    }
  };
  return attach;
});
