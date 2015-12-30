angular.module('dd-payFactories', [])

.factory('CheckFactory', ['$http', function ($http) {
  var getCheckItems = function (pid) {
    return $http({
      url: 'http://localhost:8000/api/parties/' + pid + '/menuitems',
      method: 'GET'
    });
  };
  var chargeCard = function (paymentSummary) {
    return $http({
      url: 'http://localhost:8000/api/charges',
      method: 'POST',
      data: paymentSummary
    }).then(function () {
<<<<<<< HEAD
      return $http({
        url: 'http://localhost:8000/api/parties/' + $window.localStorage.getItem('partyId') + '?event=close',
        method: 'PUT'
      });
    }).then(function () {
        $window.localStorage.removeItem('partyInfo');
        $window.localStorage.removeItem('partyId');
        $window.localStorage.removeItem('restaurantId');
=======
>>>>>>> Completed bill splitting
        console.log('charged sucessfully');
    });
  };
  return {
    getCheckItems: getCheckItems,
    chargeCard: chargeCard
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
}]);
