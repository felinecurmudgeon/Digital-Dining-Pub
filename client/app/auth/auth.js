angular.module('digitalDining.auth', ['digitalDining.services'])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {is_restaurant_user: true};
  $scope.showPasswordMatch = false;

  $scope.authenticated = function () {
    return Auth.isAuth();
  };

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.digitalDining', token);
        $location.path('/reservations');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
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
        console.error(error);
      });
    }
  };

  $scope.signout = function () {
    Auth.signout();
    $location.path('/login');
  };

});
