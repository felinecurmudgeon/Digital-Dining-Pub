angular.module('digitalDining.services', [])

.factory('Auth', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };
  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };
  var isAuth = function () {
    return !!$window.localStorage.getItem('com.digitalDining');
  };
  var signout = function () {
    $window.localStorage.removeItem('com.digitalDining');
    $location.path('/signin');
  };
  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
})

.factory('Restaurants', function ($http) {
  var getRestaurantInfo = function () {
    return $http({
      method: 'GET',
      url: '/api/restaurants?all=false'
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err) {
      return err;
    });
  };
  var createRestaurant = function (restaurant) {
    return $http({
      method: 'POST',
      url: '/api/restaurants',
      data: restaurant
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err) {
      return err;
    });
  };
  var updateRestaurant = function (restaurant) {
    return $http({
      method: 'PUT',
      url: '/api/restaurants/' + restaurant.id,
      data: restaurant
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err) {
      return err;
    });
  };
  return {
    getRestaurantInfo: getRestaurantInfo,
    createRestaurant: createRestaurant,
    updateRestaurant: updateRestaurant
  };
});
