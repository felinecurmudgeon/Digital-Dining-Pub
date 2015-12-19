angular.module('digitalDining.reservations', ['digitalDining.services'])

.controller('reservationsController', ['$scope', 'Reservations', function ($scope, Reservations) {
  $scope.parties = {};
  $scope.getParties = function () {
    Reservations.getCheckedInParties()
      .then(function (resp) {
        $scope.parties.waiting = resp.data;
      });
    Reservations.getSeatedParties()
      .then(function (resp) {
        $scope.parties.seated = resp.data;
      });
  };
  $scope.getParties();
}]);
