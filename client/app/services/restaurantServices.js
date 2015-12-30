angular.module('digitalDining.restaurantServices', [])

.factory('Restaurants', ['$http', function ($http) {
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
}]);
