angular.module('digitalDining.controllers', [])

//This is currently 'AppCtrl' but really only deals with login -- should probably update naming
.controller('AppCtrl', ['$state', '$scope', '$window', '$location', 'AuthFactory', function ($state, $scope, $window, $location, AuthFactory) {

  $scope.loginData = {};

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

  $scope.goToSignUp = function () {
    $state.go('signup');
  };
  //when redirected here from facebook auth callback, grab the token from the query and store it
  if ($location.path().match(/successFBLogin/)) {
    $window.localStorage.setItem('digitaldining', $location.search().token);
    setTimeout(function () {
      $state.go('nav.home');
    }, 2000);
  }
}])

.controller('AccountCtrl', ['$scope', 'PaymentFactory', function ($scope, PaymentFactory) {

  $scope.handleStripe = function (status, response) {
    console.log(status);
    console.log(response);
    if (response.error) {
      $scope.stripeError = response.error;
      // there was an error. Fix it.
    } else {
      // got stripe token, now charge it or smt
      console.log(response.id);
      PaymentFactory.submitCharge(response.id);
    }
  };

}])

.controller('RestaurantMenuCtrl', ['$scope', 'MenuFactory', 'HomeFactory', function ($scope, MenuFactory, HomeFactory) {
  $scope.menu = {};
  $scope.getMenuItems = function () {
    var restID = HomeFactory.getFocusedRestaurant();
    console.log('here', restID)
    MenuFactory.getMenuItems(restID.id).then(function (menu) {
      $scope.menu = menu;
    });
  };
  $scope.getMenuItems();

  $scope.focusMenuItem = function (item) {
    MenuFactory.focusMenuItem(item);
  };
}])

.controller('HomeCtrl', ['$scope', 'HomeFactory' , function ($scope, HomeFactory) {
  // var onSuccess = function (position) {
  //   window.alert('Latitude: ' + position.coords.latitude + '\n' +
  //         'Longitude: ' + position.coords.longitude + '\n' +
  //         'Altitude: ' + position.coords.altitude + '\n' +
  //         'Accuracy: ' + position.coords.accuracy + '\n' +
  //         'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
  //         'Heading: ' + position.coords.heading + '\n' +
  //         'Speed: ' + position.coords.speed + '\n' +
  //         'Timestamp: ' + position.timestamp + '\n');
  // };

  // var onError = function (error) {
  //   window.alert('code: ' + error.code + '\n' +
  //         'message: ' + error.message + '\n');
  // };

  // window.navigator.geolocation.getCurrentPosition(onSuccess, onError);

  $scope.displayRestaurants = function () {
    HomeFactory.getAllRestaurants().then(function (restaurants) {
      $scope.restaurants = restaurants.data.data;
      $scope.restaurants.forEach(function (rest) {
        console.log(rest.attributes);
      });
    });

  };
  $scope.displayRestaurants();
  $scope.test = [1];

  $scope.focusRestaurant = function (rest) {
    HomeFactory.focusRestaurant(rest);
  };
}])
.controller('MenuItemDisplayCtrl', ['$scope', 'MenuFactory', function ($scope, MenuFactory) {
  $scope.focusedMenuItem = {};
  $scope.getFocusedMenuItem = function () {
    $scope.focusedMenuItem = MenuFactory.getFocusedMenuItem();
  };
  $scope.getFocusedMenuItem();
}])

.controller('CheckInCtrl', ['$scope', '$stateParams', function ($scope) {
  $scope.currentWait = '';
  $scope.doCheckIn = function () {
    //add to checked in to restaurant
    //assign table number
    $scope.currentWait = 15 + ' minutes';
  };
}])

.controller('SignUpCtrl', ['$scope', '$state', '$window', 'AuthFactory', function ($scope, $state, $window, AuthFactory) {
  $scope.signupData = {};

  $scope.goToLogin = function () {
    $state.go('app');
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
}])

.controller('RestaurantDisplayCtrl', ['$scope', 'HomeFactory', function ($scope, HomeFactory) {
  $scope.focusedRestaurant = {};
  $scope.getFocusedRestaurant = function () {
    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
  };
  $scope.getFocusedRestaurant();
}])

.controller('PaymentsCtrl', ['$scope', function ($scope) {
  $scope.testingTotalForTaxAndTip = 140;
  $scope.totalWithTax = 0;
  $scope.taxAmount = 0;
  $scope.totalWithTaxAndTip = 0;
  $scope.taxCalculator = function (total) {
    $scope.taxAmount = total * 0.08;
    $scope.totalWithTax = total + $scope.taxAmount;
  };
  $scope.tipCalculator = function (total, percentage) {
    $scope.tipAmount = total * percentage;
    $scope.totalWithTaxAndTip = total + $scope.tipAmount;
  };
}]);
