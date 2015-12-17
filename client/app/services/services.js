angular.module('digitalDining.services', [])

.factory('Auth', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.digitalDining');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.digitalDining');
    $location.path('/signin');
  };
  
  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
