angular.module('dd-restCtrls', [])

.controller('RestaurantMenuCtrl', ['$scope', '$state', '$ionicPopup', '$window', 'MenuFactory', 'HomeFactory', 'OrderFactory', function ($scope, $state, $ionicPopup, $window, MenuFactory, HomeFactory, OrderFactory) {
  if (!$window.localStorage.getItem('partyId') && !$window.isCalled) {
    $window.isCalled = true;
    var confirmPopup = $ionicPopup.confirm({
      title: 'Please Check In',
      template: 'You are not able to order until you are checked in. Would you like to check in now?'
    });
    confirmPopup.then(function (res) {
     if (res) {
       $state.go('nav.checkIn');
     } else {
       console.log('Staying on the menu');
     }
    });
  }
  $scope.goToReservation = function () {
    $state.go('nav.checkIn');
  };

  $scope.getMenuItems = function () {
   HomeFactory.getFocusedRestaurant()
    .then (function (rest) {
      $scope.focusedRestaurant = rest;
        if ($window.localStorage.getItem('partyId')) {
          $scope.isCheckedIn = true;
        } else {
          $scope.isCheckedIn = false;
        }
      MenuFactory.getMenuItems(rest.id).then(function (dataObject) {
        var menuItems = dataObject.data.data;
        var categories = dataObject.data.included;
        $scope.menu = {};

        for (var itemIndex = 0; itemIndex < menuItems.length; itemIndex++) {
          if (!$scope.menu[categories[itemIndex].attributes.categoryName]) {
            menuItems[itemIndex].attributes.menuID = menuItems[itemIndex].id;
            menuItems[itemIndex].attributes.quantity = 0;
            $scope.menu[categories[itemIndex].attributes.categoryName] = [menuItems[itemIndex].attributes];
          } else {
            menuItems[itemIndex].attributes.menuID = menuItems[itemIndex].id;
            menuItems[itemIndex].attributes.quantity = 0;
            $scope.menu[categories[itemIndex].attributes.categoryName].push(menuItems[itemIndex].attributes);
          }
        }
      });
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

  $scope.sendOrder = function () {
    var partyId = JSON.parse($window.localStorage.getItem('partyId'));
    OrderFactory.sendOrder(partyId);
    $state.go('nav.currentCheck');
  };
  $scope.addItemToOrder = function (item) {
    OrderFactory.addItemToOrder(item);
  };

}])


.controller('RestaurantDisplayCtrl', ['$scope', '$state', '$window', 'HomeFactory', 'RestaurantFactory', function ($scope, $state, $window, HomeFactory, RestaurantFactory) {

  $scope.goToReservation = function () {
    $state.go('nav.checkIn');
  };

  $scope.getFocusedRestaurant = function () {
    HomeFactory.getFocusedRestaurant()
      .then(function (rest) {
        if ($window.localStorage.getItem('partyId')) {
          $scope.isCheckedIn = true;
        } else {
          $scope.isCheckedIn = false;
        }
        RestaurantFactory.formatTimes(rest);
        $scope.focusedRestaurant = rest;
      });
  };

  $scope.getFocusedRestaurant();

}])


.controller('MenuItemDisplayCtrl', ['$scope', 'MenuFactory', 'OrderFactory', 'CheckInFactory', '$window', function ($scope, MenuFactory, OrderFactory, CheckInFactory, $window) {
  $scope.getFocusedMenuItem = function () {
    $scope.focusedMenuItem = MenuFactory.getFocusedMenuItem();
  };
  $scope.getFocusedMenuItem();

  $scope.getCheckInStatus = function () {
    if ($window.localStorage.getItem('partyId')) {
      $scope.isCheckedIn = true;
    } else {
      $scope.isCheckedIn = false;
    }
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
}]);
