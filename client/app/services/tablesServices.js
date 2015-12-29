angular.module('digitalDining.tablesServices', [])

.factory('Tables', ['$http', '$window', function ($http, $window) {
  var getTables = function () {
    return $http({
      method: 'GET',
      url: '/api/tables?rid=' + $window.localStorage.getItem('restaurantId')
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  var postTable = function (newTable) {
    return $http({
      url: 'http://localhost:8000/api/tables',
      method: 'POST',
      data: {
        'restaurant_id': $window.localStorage.getItem('restaurantId'),
        'table_number': +newTable.tableNumber,
        'seats': newTable.seats
      }
    });
  };
  var updateTable = function (table) {
    return $http({
      url: 'http://localhost:8000/api/tables/' + table.id,
      method: 'PUT',
      data: {
        'table_number': +table.attributes.newTableNumber || +table.attributes.tableNumber,
        'seats': +table.attributes.newSeats || +table.attributes.seats
      }
    });
  };
  var removeTable = function (table) {
    return $http({
      url: 'http://localhost:8000/api/tables/' + table.id,
      method: 'DELETE'
    });
  };
  return {
    getTables: getTables,
    postTable: postTable,
    updateTable: updateTable,
    removeTable: removeTable
  };
}]);
