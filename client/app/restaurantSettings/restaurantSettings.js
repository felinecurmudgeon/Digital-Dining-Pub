/*jshint camelcase: false */
angular.module('digitalDining.restaurantSettings', ['digitalDining.services'])

.controller('restSettingsController', ['$scope', '$window', 'Restaurants', 'Tables', function ($scope, $window, Restaurants, Tables) {
  $scope.restaurant = {};
  $scope.tables = {};
  $scope.creation = true;
  $scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  $scope.creating = function () {
    Restaurants.getRestaurantInfo()
      .then(function (resp) {
        if (resp.data.length !== 0) {
          $scope.creation = false;
          $scope.restaurant.id = resp.data[0].id;
          $scope.restaurant.restaurant_name = resp.data[0].attributes.restaurantName;
          $scope.restaurant.restaurant_owner_id = resp.data[0].attributes.restaurantOwnerId;
          $scope.restaurant.restaurant_address = resp.data[0].attributes.restaurantAddress;
          $scope.restaurant.restaurant_city = resp.data[0].attributes.restaurantCity;
          $scope.restaurant.restaurant_state = resp.data[0].attributes.restaurantState;
          $scope.restaurant.restaurant_zip_code = resp.data[0].attributes.restaurantZipCode;
          $scope.restaurant.restaurant_description = resp.data[0].attributes.restaurantDescription;
          $scope.restaurant.restaurant_phone_number = resp.data[0].attributes.restaurantPhoneNumber;
          $scope.restaurant.restaurant_category = resp.data[0].attributes.restaurantCategory;
          $scope.restaurant.opening_hour_monday = resp.data[0].attributes.openingHourMonday;
          $scope.restaurant.closing_hour_monday = resp.data[0].attributes.closingHourMonday;
          $scope.restaurant.opening_hour_tuesday = resp.data[0].attributes.openingHourTuesday;
          $scope.restaurant.closing_hour_tuesday = resp.data[0].attributes.closingHourTuesday;
          $scope.restaurant.opening_hour_wednesday = resp.data[0].attributes.openingHourWednesday;
          $scope.restaurant.closing_hour_wednesday = resp.data[0].attributes.closingHourWednesday;
          $scope.restaurant.opening_hour_thursday = resp.data[0].attributes.openingHourThursday;
          $scope.restaurant.closing_hour_thursday = resp.data[0].attributes.closingHourThursday;
          $scope.restaurant.opening_hour_friday = resp.data[0].attributes.openingHourFriday;
          $scope.restaurant.closing_hour_friday = resp.data[0].attributes.closingHourFriday;
          $scope.restaurant.opening_hour_saturday = resp.data[0].attributes.openingHourSatday;
          $scope.restaurant.closing_hour_saturday = resp.data[0].attributes.closingHourSatday;
          $scope.restaurant.opening_hour_sunday = resp.data[0].attributes.openingHourSunday;
          $scope.restaurant.closing_hour_sunday = resp.data[0].attributes.closingHourSunday;
        }
      });
  };
  $scope.getTables = function () {
    Tables.getTables()
      .then(function (resp) {
        $scope.tables.data = resp.data;
      });
  };
  $scope.submitRestaurant = function () {
    var postRestInfo = function () {
      if ($scope.creation) {
        return Restaurants.createRestaurant($scope.restaurant);
      } else {
        return Restaurants.updateRestaurant($scope.restaurant);
      }
    };
    postRestInfo()
      .then(function (data) {
        console.log('got data ', data);
        $window.localStorage.setItem('restaurantId', data.id);
        $scope.creation = false;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.submitTable = function () {
    Tables.postTable($scope.tables.new)
      .then(function (resp) {
        var newTable = {
          id: resp.data.id,
          attributes: {
            available: true,
            restaurantId: resp.data.restaurant_id,
            seats: resp.data.seats,
            tableNumber: resp.data.table_number
          }
        };
        $scope.tables.data.push(newTable);
        delete $scope.tables.new;
      });
  };
  $scope.updateOrRemoveTable = function (table) {
    if (table.edit === true) {
      Tables.updateTable(table)
        .then(function (res) {
          table.attributes.seats = res.data.seats;
          table.attributes.tableNumber = res.data.table_number;
          table.edit = false;
        });
    } else if (table.remove === true) {
      Tables.removeTable(table)
        .then(function () {
          var index = $scope.tables.data.indexOf(table);
          $scope.tables.data.splice(index, 1);
        });
    }
  };
  $scope.creating();
  $scope.getTables();
}]);

