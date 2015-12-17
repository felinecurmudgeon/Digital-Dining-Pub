/*jshint camelcase: false */
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
      PaymentFactory.addCard(response.id);
    }
  };

}])

.controller('RestaurantMenuCtrl', ['$scope', '$state', 'MenuFactory', 'HomeFactory', 'OrderFactory', 'CheckInFactory', function ($scope, $state, MenuFactory, HomeFactory, OrderFactory, CheckInFactory) {
  $scope.getMenuItems = function () {
    var restID = HomeFactory.getFocusedRestaurant();
    MenuFactory.getMenuItems(restID.id).then(function (dataObject) {
      $scope.menu = {};
      for (var itemIndex = 0; itemIndex < dataObject.data.data.length; itemIndex++) {
        if (!$scope.menu[dataObject.data.data[itemIndex].attributes.menuCategoryId]) {
          dataObject.data.data[itemIndex].attributes.menuID = dataObject.data.data[itemIndex].id;
          dataObject.data.data[itemIndex].attributes.isOrdered = false;
          $scope.menu[dataObject.data.included[itemIndex].attributes.categoryName] = [dataObject.data.data[itemIndex].attributes];
        } else {
          dataObject.data.data[itemIndex].attributes.menuID = dataObject.data.data[itemIndex].id;
          dataObject.data.data[itemIndex].attributes.isOrdered = false;
          $scope.menu[dataObject.data.included[itemIndex].attributes.categoryName].push(dataObject.data.data[itemIndex].attributes);
        }
      }
    });
  };
  $scope.getMenuItems();

  $scope.clickLocationCheckingForOrder = function (event, item) {
    if (event.srcElement.className === 'item activated') {
      MenuFactory.focusMenuItem(item);
      $state.go('nav.menuItemDescription');
    } else if (event.srcElement.className === 'addButton icon ion-plus-circled') {
      item.isOrdered = !item.isOrdered;
      OrderFactory.addItemToOrder(item);
    } else if (event.srcElement.className === 'removeButton icon ion-minus-circled') {
      item.isOrdered = !item.isOrdered;
      OrderFactory.removeItemFromOrder(item);
    }
  };

  $scope.getPartyInfo = function () {
    $scope.partyInfo = CheckInFactory.getPartyInfo();
    $scope.isCheckedIn = CheckInFactory.getCheckInStatus();
  };
  $scope.getPartyInfo();

  $scope.sendOrder = function () {
    OrderFactory.sendOrder($scope.partyInfo.data.id);
  };
  $scope.addItemToOrder = function (item) {
    OrderFactory.addItemToOrder(item);
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
    });

  };
  $scope.displayRestaurants();
  $scope.test = [1];

  $scope.focusRestaurant = function (rest) {
    HomeFactory.focusRestaurant(rest);
  };
}])

.controller('MenuItemDisplayCtrl', ['$scope', 'MenuFactory', 'OrderFactory', 'CheckInFactory', function ($scope, MenuFactory, OrderFactory, CheckInFactory) {
  $scope.focusedMenuItem = {};
  $scope.getFocusedMenuItem = function () {
    $scope.focusedMenuItem = MenuFactory.getFocusedMenuItem();
  };
  $scope.getFocusedMenuItem();

  $scope.getCheckInStatus = function () {
    $scope.isCheckedIn = CheckInFactory.getCheckInStatus();
  };
  $scope.getCheckInStatus();

  $scope.addItemToOrder = function (item) {
    item.isOrdered = !item.isOrdered;
    OrderFactory.addItemToOrder(item);
  };
}])

.controller('CheckInCtrl', ['$scope', 'HomeFactory', 'CheckInFactory', function ($scope, HomeFactory, CheckInFactory) {
  $scope.getFocusedRestaurant = function () {
    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
  };
  $scope.getFocusedRestaurant();

  $scope.partyInfo = {
    restaurant_id: $scope.focusedRestaurant.id,
    party_size: ''
  };
  $scope.doCheckIn = function () {
    CheckInFactory.doCheckIn($scope.partyInfo);
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

.controller('RestaurantDisplayCtrl', ['$scope', 'HomeFactory', 'CheckInFactory', function ($scope, HomeFactory, CheckInFactory) {
  $scope.focusedRestaurant = {};
  $scope.getFocusedRestaurant = function () {
    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
  };
  $scope.getFocusedRestaurant();
  $scope.doCheckIn = function () {
    CheckInFactory.doCheckIn();
  };
}])

.controller('CheckCtrl', ['$scope', '$filter', 'CheckFactory', 'CheckInFactory', function ($scope, $filter, CheckFactory, CheckInFactory) {
  $scope.getPartyInfo = function () {
    $scope.partyInfo = CheckInFactory.getPartyInfo();
  };
  $scope.getPartyInfo();

  var partyId = $scope.partyInfo.data.id; //hard code this to a valid partyId for testing
  console.log(partyId);

  $scope.orderItems = [];
  $scope.subtotal = 0;
  var subtotal = 0;
  $scope.totalWithTax = 0;
  $scope.taxAmount = 0;
  $scope.totalWithTaxAndTip = 0;

  var taxCalculator = function (total) {
     return total * 1.08;
  };
  $scope.tipCalculator = function (total, percentage) {
    $scope.tipAmount = $filter('number')(total * percentage, 2);
    $scope.totalWithTaxAndTip = $filter('number')(Number($scope.tipAmount) + Number(total), 2);
  };
  $scope.doCharge = function () {
    //this should be broken out between tax amount and tip amounts and accounted for separtely in a production app
    CheckFactory.chargeCard($scope.totalWithTaxAndTip)
      .then(function () {
        console.log('charged sucessfully');
      });
  };
  $scope.getOrderItems = function () {
    CheckFactory.getCheckItems(partyId)
      .then(function (items) {
        console.log(items);
        for (var i = 0; i < items.data.included.length; i++) {
          $scope.orderItems.push(items.data.included[i].attributes);
          subtotal += items.data.included[i].attributes.price;
        }
        $scope.subtotal = $filter('number')(subtotal, 2);
        $scope.totalWithTax = $filter('number')(taxCalculator($scope.subtotal), 2);
        $scope.totalWithTaxAndTip = $scope.totalWithTax;
      });
  };
  $scope.getOrderItems();
}]);
