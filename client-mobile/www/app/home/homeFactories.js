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
  return {
    getAllRestaurants: getAllRestaurants,
    focusedRestaurant: focusedRestaurant,
    focusRestaurant: focusRestaurant,
    getFocusedRestaurant: getFocusedRestaurant
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
