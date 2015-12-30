/*jshint camelcase: false */
angular.module('digitalDining.auth', ['digitalDining.authServices'])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {is_restaurant_user: true};
  $scope.showPasswordMatch = false;
  $scope.duplicateEmail = false;
  $scope.failedLogin = false;

  $scope.authenticated = function () {
    return Auth.isAuth();
  };

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (response) {
        $window.localStorage.setItem('com.digitalDining', response.token);
        if (response.restaurantId) {
          $window.localStorage.setItem('restaurantId', response.restaurantId);
        }
        $location.path('/reservations');
      })
      .catch(function (error) {
        $scope.failedLogin = true;
        console.error(error);
      });
  };

  $scope.signup = function () {
    $scope.duplicateEmail = false;
    $scope.showPasswordMatch = false;
    if ($scope.user.password !== $scope.user.password2) {
      $scope.showPasswordMatch = true;
    } else {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.digitalDining', token);
        $location.path('/restaurantSettings');
      })
      .catch(function (error) {
        $scope.duplicateEmail = true;
        console.error(error);
      });
    }
  };

  $scope.signout = function () {
    Auth.signout();
    $location.path('/login');
  };
});
