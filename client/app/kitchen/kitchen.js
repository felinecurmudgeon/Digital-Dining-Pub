angular.module('digitalDining.kitchen', [
  'digitalDining.reservationsServices'])

.controller('kitchenController', ['$scope', 'Reservations', 'ItemsOrdered', function ($scope, Reservations, ItemsOrdered) {
  $scope.parties = {};

  $scope.getParties = function () {
    var addTableNumberToResponseAndMap = function (parties) {
      var tables = parties.included.reduce(function (acc, table) {
        acc[table.id] = table.attributes;
        return acc;
      }, {});
      parties.data.forEach(function (party) {
        party.attributes.tableNumber = tables[party.attributes.tableId].tableNumber;
      });
      return parties.data.reduce(function (acc, party) {
        acc[party.id] = party.attributes;
        acc[party.id].itemsOrdered = [];
        return acc;
      }, {});
    };
    var addMenuItemToItemsOrdered = function (itemsOrdered) {
      var menuItems = itemsOrdered.included.reduce(function (acc, menuItem) {
        acc[menuItem.id] = menuItem.attributes;
        return acc;
      }, {});
      itemsOrdered.data.forEach(function (itemOrdered) {
        itemOrdered.attributes.menuItem = menuItems[itemOrdered.attributes.menuItemId];
      });
      return itemsOrdered.data;
    };
    Reservations.getSeatedParties()
      .then(function (parties) {
        $scope.parties = addTableNumberToResponseAndMap(parties);
        /*jshint loopfunc: true */
        for (var k in $scope.parties) {
          ItemsOrdered.getItemsOrdered(k)
            .then(function (itemsOrdered) {
              addMenuItemToItemsOrdered(itemsOrdered).forEach(function (menuItem) {
                if (menuItem.attributes.servedAt === '0000-00-00 00:00:00') {
                  $scope.parties[menuItem.attributes.partyId].itemsOrdered.push(menuItem);
                }
              });
            });
        }
        /*jshint loopfunc: false */
      });
  };
  $scope.serveItem = function (item) {
    ItemsOrdered.serveItemOrdered(item)
      .then(function () {
        var index = $scope.parties[item.attributes.partyId].itemsOrdered.indexOf(item);
        $scope.parties[item.attributes.partyId].itemsOrdered.splice(index, 1);
      });
  };
  $scope.getWaitingTime = function (item) {
    var msDiff = new Date() - new Date(item.attributes.orderedAt);
    var hours = Math.floor(msDiff / 1000 / 60 / 60);
    msDiff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(msDiff / 1000 / 60);
    if (hours === 0) {
      return minutes + ' minutes';
    }
    if (hours === 1) {
      return '1 hour and ' + minutes + ' minutes';
    }
    return hours + ' hours and ' + minutes + ' minutes';
  };
  $scope.getParties();
}]);
