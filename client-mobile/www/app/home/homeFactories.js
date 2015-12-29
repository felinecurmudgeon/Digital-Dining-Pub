/*jshint camelcase: false */
angular.module('dd-homeFactories', [])

.factory('HomeFactory', ['$http', function ($http) {
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

  var convertAddress = function (address) {
    return $http({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDMFRplgg_Ayr8hZyNAK1QUSw5UNPbVmNM',
      method: 'GET'
    });
  };

  var getCheckedInRestaurant = function () {
    return $http({
      url: 'http://localhost:8000/api/parties?user=true',
      method: 'GET' 
    });
  };

  return {
    getAllRestaurants: getAllRestaurants,
    focusedRestaurant: focusedRestaurant,
    focusRestaurant: focusRestaurant,
    getFocusedRestaurant: getFocusedRestaurant,
    convertAddress: convertAddress,
    getCheckedInRestaurant: getCheckedInRestaurant
  };
}])

//adds the JWT to all outgoing http requests
.factory('AttachTokens', ['$window', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('digitaldining');
      if (jwt) {
        object.headers.authorization = jwt;
      }
      return object;
    }
  };
  return attach;
}]);
