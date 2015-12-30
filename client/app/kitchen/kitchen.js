angular.module('digitalDining.kitchen', [
  'digitalDining.reservationsServices'])

.controller('kitchenController', ['$scope', 'Reservations', function ($scope, Reservations) {
  $scope.parties = {};

  $scope.getParties = function () {
    var addTableNumberToResponseAndMap = function (resp) {
      var tables = resp.included.reduce(function (acc, table) {
        acc[table.id] = table.attributes;
        return acc;
      }, {});
      resp.data.forEach(function (party) {
        party.attributes.tableNumber = tables[party.attributes.tableId].tableNumber;
      });
      return resp.data.reduce(function (acc, party) {
        acc[party.id] = party.attributes;
        return acc;
      }, {});
    };
    Reservations.getSeatedParties()
      .then(function (resp) {
        $scope.parties = addTableNumberToResponseAndMap(resp);
      });
  };

  $scope.getParties();
}]);
