angular.module('digitalDining.services', [])

.factory('MenuFactory', function ($http) {
  var getMenuItems = function () {
    return $http({
      url: 'TBD',
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

.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      console.log('hooking onto request');
      var jwt = $window.localStorage.getItem('digitaldining');
      if (jwt) {
      console.log('adding jwt to headers');
        object.headers.authorization = 'Bearer ' + jwt;
      }
      console.dir(object);
      return object;
    }
  };
  return attach;
});
