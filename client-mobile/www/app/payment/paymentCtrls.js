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

.controller('CheckCtrl', ['$scope', '$state', '$filter', 'CheckFactory', 'CheckInFactory', 'OrderFactory', 'HomeFactory', '$window', function ($scope, $state, $filter, CheckFactory, CheckInFactory, OrderFactory, HomeFactory, $window) {

  $scope.orderItems = [];
  $scope.bill = {
    subtotal: 0,
    tax: 0,
    tip: 0
  };

  $scope.getCheckedInStatusAndMenuItems = function () {
    HomeFactory.getFocusedRestaurant()
     .then (function (rest) {
      $scope.focusedRestaurant = rest;
       if ($window.localStorage.getItem('partyId')) {
         $scope.isCheckedIn = true;
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
       } else {
         $scope.isCheckedIn = false;
       }
    });
  };

  $scope.getCheckedInStatusAndMenuItems();

  $scope.total = function () {
    var total = $scope.bill.subtotal + $scope.bill.tax + Number($scope.bill.tip);
    return 'Total:\n' + $filter('currency')(Number(total).toFixed(2));
  };

  $scope.taxPlusSubtotal = function () {
    var taxPlusSub = Number($scope.bill.subtotal) + Number($scope.bill.tax);
    return 'Total with tax: \n' + $filter('currency')(taxPlusSub.toFixed(2));
  };

  var taxCalculator = function (total) {
     return total * 0.08;
  };

  $scope.tipCalculator = function (percentage) {
    $scope.bill.tip = (($scope.bill.tax + $scope.bill.subtotal) * percentage).toFixed(2);
  };

  $scope.updatePay = function () {
    calcSubtotalAndTax();
  };

  var calcSubtotalAndTax = function () {
    $scope.bill.subtotal = 0;
    for (var i = 0; i < $scope.orderItems.length; i++) {
      if ($scope.orderItems[i].selected) {
        $scope.bill.subtotal += +$scope.orderItems[i].payAmount;
      }
    }
    $scope.bill.tax = taxCalculator($scope.bill.subtotal);
  };

  $scope.togglePay = function (item) {
    item.payAmount = item.price - item.totalPaid;
    calcSubtotalAndTax();
  };

  //doCharge organizes the payment information in the following format:
  //{
  //  itemId1: amountPaid1,
  //  itemId2: amountPaid2,
  //  ...
  //  total: totalPaid (includes tax and tip)
  //}
  $scope.doCharge = function () {
    //this should be broken out between tax amount and tip amounts and accounted for separtely in a production app
    var paymentSummary = {};
    paymentSummary.total = Number($scope.bill.subtotal) + Number($scope.bill.tax) + Number($scope.bill.tip);
    for (var i = 0; i < $scope.orderItems.length; i++) {
      if ($scope.orderItems[i].selected) {
        paymentSummary[$scope.orderItems[i].id] = {
                                                    payAmount: $scope.orderItems[i].payAmount,
                                                    price: $scope.orderItems[i].price
                                                  };
      }
    }
    CheckFactory.chargeCard(paymentSummary).then( function () {
      $scope.isBilled = true;
      // setTimeout( function () {
      //   $state.go('nav.home');
      // }, 2000);
    });
  };

  $scope.getOrderItems = function () {
    CheckFactory.getCheckItems($window.localStorage.getItem('partyId'))
      .then(function (items) {
        for (var i = 0; i < items.data.data.length; i++) {
          $scope.orderItems.push(items.data.data[i].attributes);
          $scope.orderItems[i].price = items.data.included[i].attributes.price;
          $scope.orderItems[i].title = items.data.included[i].attributes.title;
          $scope.orderItems[i].id = items.data.data[i].id;
          $scope.orderItems[i].payAmount = $scope.orderItems[i].price - $scope.orderItems[i].totalPaid;
        }
      });
  };
  $scope.getOrderItems();
}]);
