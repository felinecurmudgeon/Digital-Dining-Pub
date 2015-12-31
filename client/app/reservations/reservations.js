angular.module('digitalDining.reservations', [
  'digitalDining.reservationsServices',
  'digitalDining.tablesServices'])

.controller('reservationsController', ['$scope', 'Reservations', 'Tables', function ($scope, Reservations, Tables) {
  $scope.parties = {};
  $scope.tables = {
    available: [],
    occupied: []
  };
  $scope.getParties = function () {
    var addTableNumberToResponse = function (resp) {
      var tables = resp.included.reduce(function (acc, table) {
        acc[table.id] = table.attributes;
        return acc;
      }, {});
      resp.data.forEach(function (party) {
        party.attributes.tableNumber = tables[party.attributes.tableId].tableNumber;
      });
      return resp.data;
    };
    Reservations.getCheckedInParties()
      .then(function (resp) {
        $scope.parties.waiting = resp.data;
      });
    Reservations.getSeatedParties()
      .then(function (resp) {
        $scope.parties.seated = addTableNumberToResponse(resp);
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
    Reservations.seatParty(party, table)
      .then(function () {
        var index = $scope.parties.waiting.indexOf(party);
        var partySeated = $scope.parties.waiting.splice(index, 1)[0];
        partySeated.attributes.tableNumber = table.attributes.tableNumber;
        $scope.parties.seated.push(partySeated);
      });
  };
  $scope.getParties();
  $scope.getTables();
}]);
