angular.module('dd-payCtrls', [])

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

.controller('CheckCtrl', ['$scope', '$state', '$filter', 'CheckFactory', 'CheckInFactory', 'OrderFactory', '$window', function ($scope, $state, $filter, CheckFactory, CheckInFactory, OrderFactory, $window) {

  $scope.isCheckedIn = false;
  $scope.partyInfo = {};
  $scope.orderItems = [];
  $scope.subtotal = 0;
  var subtotal = 0;
  $scope.totalWithTax = 0;
  $scope.taxAmount = 0;
  $scope.totalWithTaxAndTip = 0;

  $scope.getCheckedInStatus = function () {
    $scope.partyInfo = JSON.parse($window.localStorage.getItem('partyInfo'));
    if ($window.localStorage.getItem('partyInfo')) {
      $scope.isCheckedIn = true;
    } else {
      $scope.isCheckedIn = false;
    }
  };

  $scope.getCheckedInStatus();

  var taxCalculator = function (total) {
     return total * 1.08;
  };
  $scope.tipAmount = 0;
  $scope.tipCalculator = function (total, percentage) {
    $scope.tipAmount = $filter('number')(total * percentage, 2);
    //$scope.totalWithTaxAndTip = $filter('number')(Number($scope.tipAmount) + Number(total), 2);
  };
  $scope.doCharge = function () {
    //this should be broken out between tax amount and tip amounts and accounted for separtely in a production app
    CheckFactory.chargeCard($scope.totalWithTaxAndTip).then( function () {
      $scope.isBilled = true;
      setTimeout( function () {
        $state.go('nav.home');
      }, 2000);
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
}]);