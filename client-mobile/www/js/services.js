/*jshint camelcase: false */
angular.module('digitalDining.services', [])

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

.factory('HomeFactory', ['$http', function ($http) {
  var getAllRestaurants = function () {
    return $http({
      url: 'http://localhost:8000/api/restaurants',
      method: 'GET'
    });
  };
  var focusedRestaurant = {};
  var focusRestaurant = function (rest) {
    focusedRestaurant = rest;
  };
  var getFocusedRestaurant = function () {
    return focusedRestaurant;
  };
  return {
    getAllRestaurants: getAllRestaurants,
    focusedRestaurant: focusedRestaurant,
    focusRestaurant: focusRestaurant,
    getFocusedRestaurant: getFocusedRestaurant
  };
}])

.factory('CheckFactory', ['$http', function ($http) {
  var getCheckItems = function (pid) {
    return $http({
      url: 'http://localhost:8000/api/parties/' + pid + '/menuitems',
      method: 'GET'
    });
  };
  var chargeCard = function (amt) {
    return $http({
      url: 'http://localhost:8000/api/charges',
      method: 'POST',
      data: {
        amount: amt
      }
    });
  };
  return {
    getCheckItems: getCheckItems,
    chargeCard: chargeCard
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
    order = {};
  }

  var sendOrder = function (pid) {
    pid = pid || 1;
    console.log('hit');
    var temp = order.menu_items;
    order.menu_items = [];
    return $http({
      url: 'http://localhost:8000/api/parties/' + pid + '/menuitems',
      method: 'POST',
      data: temp
    });
  };
  return {
    sendOrder: sendOrder,
    order: order,
    clearOrder: clearOrder,
    addItemToOrder: addItemToOrder,
    removeItemFromOrder: removeItemFromOrder
  };
}])

.factory('PaymentFactory', ['$http', function ($http) {
  var addCard = function (token) {
    return $http({
      url: 'http://localhost:8000/api/charges/addcard',
      method: 'POST',
      data: {
        'stripeToken' : token
      }
    });
  };
  return {
    addCard: addCard
  };
}])

//adds the JWT to all outgoing http requests
.factory('AttachTokens', ['$window', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('digitaldining');
      if (jwt) {
        object.headers.authorization = jwt;
      }
      return object;
    }
  };
  return attach;
}])
.factory('CheckInFactory', ['$http', '$window', function ($http, $window) {
  var partyInfo = {};
  var isCheckedIn = false;
  var getCheckInStatus = function () {
    return isCheckedIn;
  };
  var doCheckIn = function (data) {
    isCheckedIn = true;
    return $http({
      url: 'http://localhost:8000/api/parties',
      method: 'POST',
      data: data
    }).then( function (response) {
      $window.localStorage.setItem('partyInfo', JSON.stringify(response));
      $window.localStorage.setItem('partyId', JSON.stringify(response.data.id));
      $window.localStorage.setItem('restaurantId', JSON.stringify(response.data.restaurant_id));

    });
  };
  var getPartyInfo = function () {
    return partyInfo;
  };
  return {
    getCheckInStatus: getCheckInStatus,
    isCheckedIn: isCheckedIn,
    doCheckIn: doCheckIn,
    getPartyInfo: getPartyInfo
  };
}])

.factory('AuthFactory', ['$state', '$window', '$http', function ($state, $window, $http) {
  var signin = function (loginData) {
    return $http({
      method: 'POST',
      url: 'http://localhost:8000/api/signin',
      data: {
        username: loginData.username,
        password: loginData.password
      }
    })
    .then(function (resp) {
      console.log('validated');
      $window.localStorage.setItem('digitaldining', resp.data.token);
      $state.go('nav.home');
      return true;
    })
    .catch(function (err) {
      console.log('err = ', err);
      if (err) {
        return false;
      }
    });
  };

  var signup = function (signupData) {
    return $http({
      method: 'POST',
      url: 'http://localhost:8000/api/signup',
      data: {
        username: signupData.username,
        password: signupData.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('digitaldining', resp.data.token);
      $state.go('nav.home');
      return true;
    })
    .catch(function (err) {
      if (err.status === 409) {
        return false;
      }
    });
  };

  return {
    signin: signin,
    signup: signup
  };
}]);
