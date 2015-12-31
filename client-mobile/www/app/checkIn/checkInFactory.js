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
      // url: 'http://localhost:8000/api/parties',
      url: window.isMobileDev ? 'http://localhost:8000/api/parties' : 'http://ec2-52-33-106-186.us-west-2.compute.amazonaws.com/api/parties',
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

  var getUsers = function () {
    return $http({
      // url: 'http://localhost:8000/api/users?custonly=true',
      url: window.isMobileDev ? 'http://localhost:8000/api/users?custonly=true' : 'http://ec2-52-33-106-186.us-west-2.compute.amazonaws.com/api/users?custonly=true',
      method: 'GET'
    });
  };

  var addUsersToParty = function (userId) {
    return $http({
      // url: 'http://localhost:8000/api/parties/' + $window.localStorage.getItem('partyId') + '?event=addParticipant',
      url: window.isMobileDev ? 'http://localhost:8000/api/parties/' + $window.localStorage.getItem('partyId') + '?event=addParticipant' : 'http://ec2-52-33-106-186.us-west-2.compute.amazonaws.com/api/parties/' + $window.localStorage.getItem('partyId') + '?event=addParticipant',
      method: 'PUT',
      data: {
        'user_id' : userId
      }
    });
  };

  return {
    getCheckInStatus: getCheckInStatus,
    isCheckedIn: isCheckedIn,
    doCheckIn: doCheckIn,
    getPartyInfo: getPartyInfo,
    getUsers: getUsers,
    addUsersToParty: addUsersToParty
  };
}]);
