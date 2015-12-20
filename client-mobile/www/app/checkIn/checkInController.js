/*jshint camelcase: false */
angular.module('dd-checkInCtrl', [])

.controller('CheckInCtrl', ['$scope', '$state', '$window', 'HomeFactory', 'CheckInFactory', function ($scope, $state, $window, HomeFactory, CheckInFactory) {
  $scope.isCheckedIn = false;
  console.log('routed to checkIn');

  $scope.updateCheckedInStatus = function () {
    if ($window.localStorage.getItem('partyInfo')) {
      $scope.isCheckedIn = true;
    } else {
      $scope.isCheckedIn = false;
    }
    console.log('$scope.isCheckedIn is ', $scope.isCheckedIn);
  };

  $scope.updateCheckedInStatus();

  $scope.getCheckInStatus = function () {
    return $scope.isCheckedIn;
  };

  $scope.getFocusedRestaurant = function () {
    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
  };
  $scope.getFocusedRestaurant();

  $scope.partyInfo = {
    restaurant_id: $scope.focusedRestaurant.id,
    party_size: ''
  };
  $scope.doCheckIn = function () {
    CheckInFactory.doCheckIn($scope.partyInfo).then( function () {
      $state.go('nav.restaurantMenu');
    });
    // setTimeout(function () {
    //   $state.go('nav.restaurantMenu')
    // },2000);
    $scope.isCheckedIn = true;
  };

  $scope.footersrc = 'restaurantFooter.html';

}]);