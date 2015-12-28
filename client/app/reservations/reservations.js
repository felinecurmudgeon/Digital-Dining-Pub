angular.module('digitalDining.reservations', ['digitalDining.services'])

.controller('reservationsController', ['$scope', 'Reservations', 'Tables', function ($scope, Reservations, Tables) {
  $scope.parties = {};
  $scope.tables = {
    available: [],
    occupied: []
  };
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
        resp.data.forEach(function (table) {
          if (table.attributes.available) {
            $scope.tables.available.push(table);
          } else {
            $scope.tables.occupied.push(table);
          }
        });
      });
  };
  $scope.seatParty = function (party, table) {
    Reservations.seatParty(party, table);
    console.log(party);
  };
  $scope.getParties();
  $scope.getTables();
}]);
//TODO add a ngclick in the view to seat people, and send this to the server
