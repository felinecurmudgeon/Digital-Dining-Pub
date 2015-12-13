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

//adds the JWT to all outgoing http requests
.factory('AttachTokens', function ($window) {
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
})

.factory('AuthFactory', ['$state', '$window', '$http', function ($state, $window, $http) {
  var signin = function (loginData) {
    return $http({
      method: 'POST',
      url: 'http://localhost:8000/api/signin',
      data: {
        username: loginData.username,
        password: loginData.password
      }
    })
    .then(function (resp) {
      console.log('validated');
      $window.localStorage.setItem('digitaldining', resp.data.token);
      $state.go('nav.home');
      return true;
    })
    .catch(function (err) {
      console.log('err = ', err);
      if (err) {
        return false;
      }
    });
  };

  var signup = function (signupData) {
    return $http({
      method: 'POST',
      url: 'http://localhost:8000/api/signup',
      data: {
        username: signupData.username,
        password: signupData.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('digitaldining', resp.data.token);
      $state.go('nav.home');
      return true;
    })
    .catch(function (err) {
      if (err.status === 409) {
        return false;
      }
    });
  };

  return {
    signin: signin,
    signup: signup
  };
}]);
