angular.module('digitalDining.reservations', ['digitalDining.services'])

.controller('reservationsController', ['$scope', 'Reservations', 'Tables', function ($scope, Reservations, Tables) {
  $scope.parties = {};
  $scope.table = {};
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
  $scope.getTables = function () {
    Tables.getTables()
      .then(function (resp) {
        $scope.tables = resp.data;
      });
  };
  $scope.getParties();
  $scope.getTables();
}]);
//TODO add a ngclick in the view to seat people, and send this to the server
