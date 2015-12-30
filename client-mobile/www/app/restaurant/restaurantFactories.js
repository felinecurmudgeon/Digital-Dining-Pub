/*jshint camelcase: false */
angular.module('dd-restFactories', [])

.factory('MenuFactory', ['$http', function ($http) {
  var getMenuItems = function (restID) {
    return $http({
      url: 'http://localhost:8000/api/menuitems/?rid=' + restID,
      method: 'GET'
    });
  };
  var getSpecificMenu = function () {
    return $http({
      url: 'TBD',
      method: 'GET'
    });
  };
  var addMenuItemToOrder = function (item) {
    return $http({
      url: 'TBD',
      method: 'POST',
      data: {item: item}
    });
  };
  var focusedMenuItem = {};
  var focusMenuItem = function (item) {
    focusedMenuItem = item;
  };
  var getFocusedMenuItem = function () {
    return focusedMenuItem;
  };
  return {
    getMenuItems: getMenuItems,
    getSpecificMenu: getSpecificMenu,
    addMenuItemToOrder: addMenuItemToOrder,
    focusedMenuItem: focusedMenuItem,
    focusMenuItem: focusMenuItem,
    getFocusedMenuItem: getFocusedMenuItem
  };
}])

.factory('OrderFactory', ['$http', function ($http) {
  var order = {
    menu_items: []
  };
  var addItemToOrder = function (item, quantity) {
    console.log(item);
    quantity = quantity || 1;
    order.menu_items.push({
      menu_item_id: item.menuID,
      quantity: quantity
    });
    console.log('item', order);
  };
  var removeItemFromOrder = function (item) {
    for (var i = 0; i < order.menu_items.length; i++) {
      if (order.menu_items[i].menu_item_id === item.menuID) {
        order.menu_items.splice(i, 1);
        i--;
      }
    }
  };
  var clearOrder = function () {
    order.menu_items = [];
  };

  var sendOrder = function (pid) {
    pid = pid || 1;
    var temp = order.menu_items;
    return $http({
      url: 'http://localhost:8000/api/parties/' + pid + '/menuitems',
      method: 'POST',
      data: temp
    }).then( function () {
      clearOrder();
    });
  };
  return {
    sendOrder: sendOrder,
    order: order,
    clearOrder: clearOrder,
    addItemToOrder: addItemToOrder,
    removeItemFromOrder: removeItemFromOrder
  };
}]);
