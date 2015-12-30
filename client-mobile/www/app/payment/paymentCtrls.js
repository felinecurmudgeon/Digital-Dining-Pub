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
  $scope.invalidInput = false;
  $scope.isBilled = false;

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

  //payment value must be valid (4.3, 0.45, 14 are examples of valid inputs) and no bigger than the remaining cost
  var checkInputs = function (item) {
    if (typeof item.payAmount !== 'number' && !item.payAmount.match(/^([1-9]{1}[0-9]{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))$|^([1-9]{1}\d{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))$|^\(\$?([1-9]{1}\d{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))\)$/)) {
      return false;
    } else if (Number(item.payAmount) > Number(item.price) - Number(item.totalPaid) + 0.001) {
      return false;
    } else {
      return true;
    }
  };

  $scope.togglePay = function (item) {
    item.payAmount = (Number(item.price) - Number(item.totalPaid)).toFixed(2);
    calcSubtotalAndTax();
  };

  $scope.doCharge = function () {
    //this should be broken out between tax amount and tip amounts and accounted for separately in a production app
    $scope.invalidInput = false;
    var paymentSummary = {
                          items: []
    };
    paymentSummary.total = Number($scope.bill.subtotal) + Number($scope.bill.tax) + Number($scope.bill.tip);
    for (var i = 0; i < $scope.orderItems.length; i++) {
      if (!checkInputs($scope.orderItems[i])) {
        $scope.invalidInput = true;
        return;
      }
      if ($scope.orderItems[i].selected) {
        paymentSummary.items.push({
                                  totalPaid: Number($scope.orderItems[i].payAmount) + Number($scope.orderItems[i].totalPaid),
                                  price: $scope.orderItems[i].price,
                                  id: $scope.orderItems[i].id
        });
      }
    }
    CheckFactory.chargeCard(paymentSummary).then(function () {
      $scope.isBilled = true;
      setTimeout( function () {
        $scope.isBilled = false;
        var allPaid = true;
        for (var i = 0; i < $scope.orderItems.length; i++) {
          //after payment, we must check if there are any unpaid items left over
          //an item is paid for if either .paid = true, or if it is both selected and has a payAmount + totalPaid
          //equal (or greater) to the price of the item
          //the extra 0.001 is to prevent any floating point shenanigans
          if (!$scope.orderItems[i].paid && !($scope.orderItems[i].selected && (Number($scope.orderItems[i].payAmount) + Number($scope.orderItems[i].totalPaid) + 0.001 >= Number($scope.orderItems[i].price)))) {
            allPaid = false;
          }
        }
        if (allPaid) {
          $state.go('nav.home');
          $window.localStorage.removeItem('partyInfo');
          $window.localStorage.removeItem('partyId');
          $window.localStorage.removeItem('restaurantId');
        } else {
          $scope.getOrderItems();
        }
      }, 2000);
    });
  };

  $scope.getOrderItems = function () {
    CheckFactory.getCheckItems($window.localStorage.getItem('partyId'))
      .then(function (items) {
        $scope.orderItems = [];
        for (var i = 0; i < items.data.data.length; i++) {
          $scope.orderItems.push(items.data.data[i].attributes);
          $scope.orderItems[i].price = items.data.included[i].attributes.price;
          $scope.orderItems[i].title = items.data.included[i].attributes.title;
          $scope.orderItems[i].id = items.data.data[i].id;
          $scope.orderItems[i].payAmount = ($scope.orderItems[i].price - $scope.orderItems[i].totalPaid).toFixed(2);
          if (Number($scope.orderItems[i].payAmount) === 0) {
            $scope.orderItems[i].paid = true;
          } else {
            $scope.orderItems[i].paid = false;
          }
        }
      });
  };
  $scope.getOrderItems();
}]);
