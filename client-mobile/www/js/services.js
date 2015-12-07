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
});

