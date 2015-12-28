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
    //check if user is in a party

    //if yes, make restID the party restaurant 

    //if no, use focusedRestaurant

    var currentRestaurant = HomeFactory.getFocusedRestaurant();


    MenuFactory.getMenuItems(currentRestaurant.id).then(function (dataObject) {
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
    $scope.rest = currentRestaurant;
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


.controller('RestaurantDisplayCtrl', ['$scope', '$state', 'HomeFactory', function ($scope, $state, HomeFactory) {
  $scope.getFocusedRestaurant = function () {
    //check if user is in a party

    //if yes, make $scope.focusedRestaurant the party restaurant 

    //if no, use focusedRestaurant from homefactory

    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
  };

  $scope.getFocusedRestaurant();

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
