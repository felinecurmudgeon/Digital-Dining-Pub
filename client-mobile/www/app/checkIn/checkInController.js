/*jshint camelcase: false */
angular.module('dd-checkInCtrl', [])

.controller('CheckInCtrl', ['$scope', '$state', '$window', 'HomeFactory', 'CheckInFactory', function ($scope, $state, $window, HomeFactory, CheckInFactory) {
  $scope.isCheckedIn = false;
  $scope.hasRestaurant = true;
  $scope.focusedRestaurant = null;
  $scope.partyInfo = {};

  $scope.updateStatus = function () {
    if ($window.localStorage.getItem('partyInfo')) {
      $scope.isCheckedIn = true;
    } else {
      $scope.isCheckedIn = false;
    }
    if (Object.keys($scope.focusedRestaurant).length > 0) {
      $scope.hasRestaurant = true;
    } else {
      $scope.hasRestaurant = false;
    }
  };

  $scope.getCheckInStatus = function () {
    return $scope.isCheckedIn;
  };

  $scope.getFocusedRestaurant = function () {
    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
    $scope.partyInfo.restaurant_id = $scope.focusedRestaurant.id;
    $scope.partyInfo.party_size = '';
    console.log($scope.focusedRestaurant);
  };

  $scope.doCheckIn = function () {
    CheckInFactory.doCheckIn($scope.partyInfo).then( function () {
      $state.go('nav.restaurantMenu');
      $scope.isCheckedIn = true;
    });
  };

  $scope.getUsers = function () {
    CheckInFactory.getUsers()
      .then(function (users) {
        $scope.users = users;
      })
  };

  $scope.addUsersToParty = function () {
    console.log($scope.selectedUser); //TODO: figure out why this isn't coming through from HTML 
    CheckInFactory.addUsersToParty(10); //hardcoded until line above is fixed
  }

  $scope.getFocusedRestaurant();
  $scope.updateStatus();
  $scope.getUsers();

}]);
