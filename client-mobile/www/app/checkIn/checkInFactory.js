/*jshint camelcase: false */
angular.module('dd-checkInFactory', [])

.factory('CheckInFactory', ['$http', '$window', function ($http, $window) {
  var partyInfo = {};
  var isCheckedIn = false;
  var getCheckInStatus = function () {
    return isCheckedIn;
  };
  var doCheckIn = function (data) {
    isCheckedIn = true;
    return $http({
      url: 'http://localhost:8000/api/parties',
      method: 'POST',
      data: data
    }).then( function (response) {
      $window.localStorage.setItem('partyInfo', JSON.stringify(response));
      $window.localStorage.setItem('partyId', JSON.stringify(response.data.id));
      $window.localStorage.setItem('restaurantId', JSON.stringify(response.data.restaurant_id));
    });
  };
  var getPartyInfo = function () {
    return partyInfo;
  };
  return {
    getCheckInStatus: getCheckInStatus,
    isCheckedIn: isCheckedIn,
    doCheckIn: doCheckIn,
    getPartyInfo: getPartyInfo
  };
}]);