angular.module('dd-authCtrl', [])

.controller('AuthCtrl', ['$state', '$scope', '$window', '$location', 'AuthFactory', function ($state, $scope, $window, $location, AuthFactory) {

  $scope.loginData = {};
  $scope.signupData = {};

  $scope.logout = function () {
    if ($window.localStorage.getItem('digitaldining')) {
      $window.localStorage.removeItem('digitaldining');
    }
    $state.go('app');
  };

  $scope.doLogin = function () {
    $scope.invalidLogin = false;
    AuthFactory.signin($scope.loginData).then(function (verified) {
      if (!verified) {
        $scope.invalidLogin = true;
      }
    });
    $scope.loginData.username = '';
    $scope.loginData.password = '';
  };

  $scope.doSignUp = function () {
    AuthFactory.signup($scope.signupData).then(function (verified) {
      if (!verified) {
        $scope.invalidUsername = true;
      }
    });
    $scope.signupData.username = '';
    $scope.signupData.password = '';
  };

  $scope.goToSignUp = function () {
    $state.go('signup');
  };


  $scope.goToLogin = function () {
    $state.go('app');
  };
  //when redirected here from facebook auth callback, grab the token from the query and store it
  if ($location.path().match(/successFBLogin/)) {
    $window.localStorage.setItem('digitaldining', $location.search().token);
    setTimeout(function () {
      $state.go('nav.home');
    }, 2000);
  }
}]);