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
  var sendOrder = function (pid) {
    pid = pid || 1;
    console.log('hit');
    return $http({
      url: 'http://localhost:8000/api/parties/' + pid + '/menuitems',
      method: 'POST',
      data: order.menu_items
    });
  };
  return {
    sendOrder: sendOrder,
    order: order,
    addItemToOrder: addItemToOrder
  };
}])

.factory('PaymentFactory', ['$http', function ($http) {
  var submitCharge = function (token) {
    return $http({
      url: 'http://localhost:8000/api/charges',
      method: 'POST',
      data: {
        'amount' : '50',
        'stripeToken' : token
      }
    });
  };
  return {
    submitCharge: submitCharge
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
.factory('CheckInFactory', ['$http', function ($http) {
  var partyInfo = {};
  var doCheckIn = function (data) {
    return $http({
      url: 'http://localhost:8000/api/parties',
      method: 'POST',
      data: data
    }).then( function (response) {
      partyInfo = response;
    });
  };
  var getPartyInfo = function () {
    return partyInfo;
  };
  return {
    doCheckIn: doCheckIn,
    partyInfo: partyInfo,
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
