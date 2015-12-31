/*jshint camelcase: false */
angular.module('dd-restFactories', [])

.factory('RestaurantFactory', function () {

  var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satday', 'Sunday'];

  var convertToSimple = function (time) {
    var splitTime = time.split(':');
    var tag = '';
    if ((Number(splitTime[0]) >= 0 && Number(splitTime[0]) <= 11) || Number(splitTime[0]) >= 24) {
      tag = 'AM';
    } else {
      tag = 'PM';
    }

    splitTime[0] = Number(splitTime[0]) % 12;

    if (splitTime[0] === 0) {
      splitTime[0] = 12;
    }

    splitTime[0] = splitTime[0].toString();
    console.log(splitTime[0] + ':' + splitTime[1] + ' ' + tag);
    return splitTime[0] + ':' + splitTime[1] + ' ' + tag;
  };

  var formatTimes = function (restaurant) {
    var openTime, closeTime;
    for (var i = 0; i < days.length; i++) {
      console.log('restaurant.attributes[' + 'openingHour' + days[i] + '] = ', restaurant.attributes['openingHour' + days[i]]);
      if (restaurant.attributes['openingHour' + days[i]]) {
        openTime = convertToSimple(restaurant.attributes['openingHour' + days[i]]);
        closeTime = convertToSimple(restaurant.attributes['closingHour' + days[i]]);
      }
      if (openTime === closeTime) {
        restaurant.attributes[days[i] + 'Hours'] = 'Closed';
      } else {
        restaurant.attributes[days[i] + 'Hours'] = openTime + ' - ' + closeTime;
      }
    }
  };

  return {
    formatTimes: formatTimes
  };
})

.factory('MenuFactory', ['$http', function ($http) {
  var getMenuItems = function (restID) {
    return $http({
      // url: 'http://localhost:8000/api/menuitems/?rid=' + restID,
      url: window.isMobileDev ? 'http://localhost:8000/api/menuitems/?rid=' + restID : 'http://ec2-52-33-106-186.us-west-2.compute.amazonaws.com/api/menuitems/?rid=' + restID,
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
    quantity = quantity || 1;
    order.menu_items.push({
      menu_item_id: item.menuID,
      quantity: quantity
    });
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
      // url: 'http://localhost:8000/api/parties/' + pid + '/menuitems',
      url: window.isMobileDev ? 'http://localhost:8000/api/parties/' + pid + '/menuitems' : 'http://ec2-52-33-106-186.us-west-2.compute.amazonaws.com/api/parties/' + pid + '/menuitems',
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
