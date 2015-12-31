angular.module('dd-authFactory', [])

.factory('AuthFactory', ['$state', '$window', '$http', function ($state, $window, $http) {
  var signin = function (loginData) {
    return $http({
      method: 'POST',
      url: window.isDevProduction ? 'http://localhost:8000/api/signin' : 'http://ec2-52-33-106-186.us-west-2.compute.amazonaws.com/api/signin',
      data: {
        username: loginData.username,
        password: loginData.password
      }
    })
    .then(function (resp) {
      console.log('validated');
      $window.localStorage.setItem('digitaldining', resp.data.token);
      $state.go('nav.home');
      return true;
    })
    .catch(function (err) {
      console.log('err = ', err);
      if (err) {
        return false;
      }
    });
  };

  var signup = function (signupData) {
    return $http({
      method: 'POST',
      // url: 'http://localhost:8000/api/signup',
      url: window.isDevProduction ? 'http://localhost:8000/api/signup' : 'http://ec2-52-33-106-186.us-west-2.compute.amazonaws.com/api/signup',
      data: {
        username: signupData.username,
        password: signupData.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('digitaldining', resp.data.token);
      $state.go('nav.home');
      return true;
    })
    .catch(function (err) {
      if (err.status === 409) {
        return false;
      }
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('digitaldining');
  };

  return {
    isAuth: isAuth,
    signin: signin,
    signup: signup
  };
}]);