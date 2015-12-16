angular.module('dd-services', [])

.factory('MenuFactory', ['$http', function ($http) {
  var getMenuItems = function (restID) {
    return $http({
      url: 'http://localhost:8000/api/menuitems/?rid=' + restID,
      method: 'GET'
    });
  };

  var postMenuItem = function () {
    return $http({
      url: 'http://localhost:8000/api/menuitems/?rid=' + restID,
      method: 'POST',
      data: {
      }
    });
  }
  
  return {
    getMenuItems: getMenuItems,
    postMenuItem: postMenuItem
  };
}]);