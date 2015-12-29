angular.module('dd-payCtrls', [])

.controller('AccountCtrl', ['$scope', '$state', 'PaymentFactory', function ($scope, $state, PaymentFactory) {

  $scope.handleStripe = function (status, response) {
    console.log(status);
    console.log(response);
    if (response.error) {
      $scope.stripeError = response.error;
      // there was an error. Fix it.
    } else {
      // got stripe token, now charge it or smt
      console.log(response.id);
      PaymentFactory.addCard(response.id).then(function () {
        $scope.hasCreditOnFile = true;
        setTimeout( function () {
          $state.go('nav.home');
        }, 2000);
      });
    }
  };

}])

.controller('CheckCtrl', ['$scope', '$state', '$filter', 'CheckFactory', 'CheckInFactory', 'OrderFactory', '$window', function ($scope, $state, $filter, CheckFactory, CheckInFactory, OrderFactory, $window) {

  $scope.isCheckedIn = false;
  $scope.partyInfo = {};
  $scope.orderItems = [];
  $scope.bill = {
    subtotal: 0,
    tax: 0,
    tip: 0
  };

  $scope.getCheckedInStatus = function () {
    $scope.partyInfo = JSON.parse($window.localStorage.getItem('partyInfo'));
    if ($window.localStorage.getItem('partyInfo')) {
      $scope.isCheckedIn = true;
    } else {
      $scope.isCheckedIn = false;
    }
  };

  $scope.total = function () {
    var total = Number($scope.bill.subtotal) + Number($scope.bill.tax) + Number($scope.bill.tip);
    return 'Total:\n' + $filter('currency')(Number(total).toFixed(2));
  };

  $scope.taxPlusSubtotal = function () {
    var taxPlusSub = Number($scope.bill.subtotal) + Number($scope.bill.tax);
    return 'Total with tax: \n' + $filter('currency')(taxPlusSub.toFixed(2));
  };

  $scope.getCheckedInStatus();

  var taxCalculator = function (total) {
     return total * 0.08;
  };

  $scope.tipCalculator = function (percentage) {
    $scope.bill.tip = ((Number($scope.bill.tax) + Number($scope.bill.subtotal)) * percentage).toFixed(2);
  };

  $scope.doCharge = function () {
    //this should be broken out between tax amount and tip amounts and accounted for separtely in a production app
    var total = Number($scope.bill.subtotal) + Number($scope.bill.tax) + Number($scope.bill.tip);
    CheckFactory.chargeCard(total).then( function () {
      $scope.isBilled = true;
      setTimeout( function () {
        $state.go('nav.home');
      }, 2000);
    });
  };

  $scope.getOrderItems = function () {
    CheckFactory.getCheckItems($window.localStorage.getItem('partyId'))
      .then(function (items) {
        var subtotal = 0;
        for (var i = 0; i < items.data.included.length; i++) {
          $scope.orderItems.push(items.data.included[i].attributes);
          subtotal += items.data.included[i].attributes.price;
        }
        $scope.bill.subtotal = subtotal.toFixed(2);
        $scope.bill.tax = taxCalculator(Number($scope.bill.subtotal)).toFixed(2);
      });
  };
  $scope.getOrderItems();
}]);
