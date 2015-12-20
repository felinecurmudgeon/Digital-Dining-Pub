angular.module('dd-restCtrls', [])

.controller('RestaurantMenuCtrl', ['$scope', '$state', '$window', 'MenuFactory', 'HomeFactory', 'OrderFactory', function ($scope, $state, $window, MenuFactory, HomeFactory, OrderFactory) {
  $scope.getPartyInfo = function () {
    console.log('partyId is ', $window.localStorage.getItem('partyId'));
    if ($window.localStorage.getItem('partyId')) {
      $scope.isCheckedIn = true;
    } else {
      $scope.isCheckedIn = false;
    }
  };
  $scope.getPartyInfo();
  $scope.getMenuItems = function () {
    var restID = HomeFactory.getFocusedRestaurant();
    MenuFactory.getMenuItems(restID.id).then(function (dataObject) {
      $scope.menu = {};
      for (var itemIndex = 0; itemIndex < dataObject.data.data.length; itemIndex++) {
        if (!$scope.menu[dataObject.data.included[itemIndex].attributes.categoryName]) {
          dataObject.data.data[itemIndex].attributes.menuID = dataObject.data.data[itemIndex].id;
          dataObject.data.data[itemIndex].attributes.quantity = 0;
          $scope.menu[dataObject.data.included[itemIndex].attributes.categoryName] = [dataObject.data.data[itemIndex].attributes];
        } else {
          dataObject.data.data[itemIndex].attributes.menuID = dataObject.data.data[itemIndex].id;
          dataObject.data.data[itemIndex].attributes.quantity = 0;
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


  $scope.sendOrder = function () {
    var partyId = JSON.parse($window.localStorage.getItem('partyId'));
    OrderFactory.sendOrder(partyId);
    $state.go('nav.currentCheck');
  };
  $scope.addItemToOrder = function (item) {
    OrderFactory.addItemToOrder(item);
  };

  //$scope.footersrc = 'restaurantFooter.html';
}])


.controller('RestaurantDisplayCtrl', ['$scope', '$state', 'HomeFactory', function ($scope, $state, HomeFactory) {
  $scope.getFocusedRestaurant = function () {
    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
  };
  $scope.getFocusedRestaurant();
  //$scope.footersrc = 'restaurantFooter.html';
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
}]);