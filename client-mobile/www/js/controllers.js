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

.controller('RestaurantMenuCtrl', ['$scope', '$state', '$window', 'MenuFactory', 'HomeFactory', 'OrderFactory', 'CheckInFactory', function ($scope, $state, $window, MenuFactory, HomeFactory, OrderFactory, CheckInFactory) {
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
    $scope.rest = restID;
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
    $scope.isCheckedIn = CheckInFactory.getCheckInStatus();
  };
  $scope.getPartyInfo();

  $scope.sendOrder = function () {
    OrderFactory.sendOrder(JSON.parse($window.localStorage.getItem('partyInfo')).data.id);
  };
  $scope.addItemToOrder = function (item) {
    OrderFactory.addItemToOrder(item);
  };

  $scope.footersrc = '../templates/restaurantFooter.html';

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
  $scope.removeItemFromOrder = function (item) {
    item.isOrdered = !item.isOrdered;
    OrderFactory.removeItemFromOrder(item);
  };
}])

.controller('CheckInCtrl', ['$scope', '$state', '$window', 'HomeFactory', 'CheckInFactory', function ($scope, $state, $window, HomeFactory, CheckInFactory) {
  
  $scope.isCheckedIn = false;

  $scope.getCheckedInStatus = function () {
    console.log("checking");
    if ($window.localStorage.getItem('partyInfo')) {
      $scope.isCheckedIn = true;
    } else {
      $scope.isCheckedIn = false;
    }
  }

  $scope.getCheckedInStatus();

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
    $state.go('nav.restaurantMenu');
    $scope.isCheckedIn = true;
  };

  $scope.footersrc = '../templates/restaurantFooter.html';

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

.controller('RestaurantDisplayCtrl', ['$scope', '$state', 'HomeFactory', function ($scope, $state, HomeFactory) {
  $scope.getFocusedRestaurant = function () {
    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
  };
  $scope.getFocusedRestaurant();
  $scope.doCheckIn = function () {
    CheckInFactory.doCheckIn();
  };
  $scope.footersrc = '../templates/restaurantFooter.html';
}])

.controller('CheckCtrl', ['$scope', '$filter', 'CheckFactory', 'CheckInFactory', 'OrderFactory', '$window', function ($scope, $filter, CheckFactory, CheckInFactory, OrderFactory, $window) {

  $scope.isCheckedIn = false;
  $scope.partyInfo = {};
  $scope.orderItems = [];
  $scope.subtotal = 0;
  var subtotal = 0;
  $scope.totalWithTax = 0;
  $scope.taxAmount = 0;
  $scope.totalWithTaxAndTip = 0;

  $scope.getCheckedInStatus = function () {
    console.log("checking");
    $scope.partyInfo = JSON.parse($window.localStorage.getItem('partyInfo'));
    if ($window.localStorage.getItem('partyInfo')) {
      $scope.isCheckedIn = true;
    } else {
      $scope.isCheckedIn = false;
    }
  }

  $scope.getCheckedInStatus();

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
        $window.localStorage.removeItem('partyInfo');
        $window.localStorage.removeItem('partyId');
        $window.localStorage.removeItem('restaurantId');
        OrderFactory.clearOrder();
        console.log('charged sucessfully');

      });
  };
  $scope.getOrderItems = function () {
    CheckFactory.getCheckItems($window.localStorage.getItem('partyId'))
      .then(function (items) {
        for (var i = 0; i < items.data.included.length; i++) {
          $scope.orderItems.push(items.data.included[i].attributes);
          subtotal += items.data.included[i].attributes.price;
        }
        $scope.subtotal = $filter('number')(subtotal, 2);
        $scope.totalWithTax = $filter('number')(taxCalculator($scope.subtotal), 2);
        $scope.totalWithTaxAndTip = $filter('number')($scope.totalWithTax, 2);
      });
  };
  $scope.getOrderItems();
  $scope.footersrc = '../templates/restaurantFooter.html';
}])
.directive('counter', function () {
    return {
        restrict: 'A',
        scope: { value: '=value' },
        template: '<a href="javascript:;" class="counter-minus" ng-click="minus()">-</a>\
                  <input type="text" class="counter-field" ng-model="value" ng-change="changed()" ng-readonly="readonly">\
                  <a  href="javascript:;" class="counter-plus" ng-click="plus()">+</a>',
        link: function ( scope , element , attributes ) {
            if ( angular.isUndefined(scope.value) ) {
              throw 'Missing the value attribute on the counter directive.';
            }
            var min = angular.isUndefined(attributes.min) ? null : parseInt(attributes.min);
            var max = angular.isUndefined(attributes.max) ? null : parseInt(attributes.max);
            var step = angular.isUndefined(attributes.step) ? 1 : parseInt(attributes.step);
            element.addClass('counter-container');
            scope.readonly = angular.isUndefined(attributes.editable) ? true : false;
            var setValue = function ( val ) {
              scope.value = parseInt( val );
            };
            setValue( scope.value );

            scope.minus = function () {
              if ( min && (scope.value <= min || scope.value - step <= min) || min === 0 && scope.value < 1 ) {
                  setValue( min );
                  return false;
              }
              setValue( scope.value - step );
            };
            scope.plus = function () {
              if ( max && (scope.value >= max || scope.value + step >= max) ) {
                  setValue( max );
                  return false;
              }
              setValue( scope.value + step );
            };
            scope.changed = function () {
              if ( !scope.value ) {
                setValue( 0 );
              }
              if ( /[0-9]/.test(scope.value) ) {
                setValue( scope.value );
              } else {
                setValue( scope.min );
              }
              if ( min && (scope.value <= min || scope.value - step <= min) ) {
                setValue( min );
                return false;
              }
              if ( max && (scope.value >= max || scope.value + step >= max) ) {
                setValue( max );
                return false;
              }
              setValue( scope.value );
            };
        }
    };
});
