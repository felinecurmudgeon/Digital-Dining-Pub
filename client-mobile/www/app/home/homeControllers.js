/*jshint camelcase: false */
angular.module('dd-homeCtrls', [])

.controller('NavCtrl', ['$state', '$scope', '$window', function ($state, $scope, $window) {

  $scope.logout = function () {
    if ($window.localStorage.getItem('digitaldining')) {
      $window.localStorage.removeItem('digitaldining');
    }
    $state.go('app');
  };

  $scope.clearStorage = function () {
    $window.localStorage.removeItem('partyInfo');
    $window.localStorage.removeItem('partyId');
    $window.localStorage.removeItem('restaurantId');
  };
}])

.controller('HomeCtrl', ['$scope', 'HomeFactory' , function ($scope, HomeFactory) {
  // var onSuccess = function (position) {
  //   window.alert('Latitude: ' + position.coords.latitude + '\n' +
  //         'Longitude: ' + position.coords.longitude + '\n' +
  //         'Altitude: ' + position.coords.altitude + '\n' +
  //         'Accuracy: ' + position.coords.accuracy + '\n' +
  //         'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
  //         'Heading: ' + position.coords.heading + '\n' +
  //         'Speed: ' + position.coords.speed + '\n' +
  //         'Timestamp: ' + position.timestamp + '\n');
  // };

  // var onError = function (error) {
  //   window.alert('code: ' + error.code + '\n' +
  //         'message: ' + error.message + '\n');
  // };

  // window.navigator.geolocation.getCurrentPosition(onSuccess, onError);

  $scope.displayRestaurants = function () {
    HomeFactory.getAllRestaurants().then(function (restaurants) {
      $scope.restaurants = restaurants.data.data;
    });

  };
  $scope.displayRestaurants();
  $scope.test = [1];

  $scope.focusRestaurant = function (rest) {
    HomeFactory.focusRestaurant(rest);
  };
}]);

// .directive('counter', function () {
//     return {
//         restrict: 'A',
//         scope: { value: '=value' },
//         template: '<a href="javascript:;" class="counter-minus" ng-click="minus()">-</a>\
//                   <input type="text" class="counter-field" ng-model="value" ng-change="changed()" ng-readonly="readonly">\
//                   <a  href="javascript:;" class="counter-plus" ng-click="plus()">+</a>',
//         link: function ( scope , element , attributes ) {
//             if ( angular.isUndefined(scope.value) ) {
//               throw 'Missing the value attribute on the counter directive.';
//             }
//             var min = angular.isUndefined(attributes.min) ? null : parseInt(attributes.min);
//             var max = angular.isUndefined(attributes.max) ? null : parseInt(attributes.max);
//             var step = angular.isUndefined(attributes.step) ? 1 : parseInt(attributes.step);
//             element.addClass('counter-container');
//             scope.readonly = angular.isUndefined(attributes.editable) ? true : false;
//             var setValue = function ( val ) {
//               scope.value = parseInt( val );
//             };
//             setValue( scope.value );

//             scope.minus = function () {
//               if ( min && (scope.value <= min || scope.value - step <= min) || min === 0 && scope.value < 1 ) {
//                   setValue( min );
//                   return false;
//               }
//               setValue( scope.value - step );
//             };
//             scope.plus = function () {
//               if ( max && (scope.value >= max || scope.value + step >= max) ) {
//                   setValue( max );
//                   return false;
//               }
//               setValue( scope.value + step );
//             };
//             scope.changed = function () {
//               if ( !scope.value ) {
//                 setValue( 0 );
//               }
//               if ( /[0-9]/.test(scope.value) ) {
//                 setValue( scope.value );
//               } else {
//                 setValue( scope.min );
//               }
//               if ( min && (scope.value <= min || scope.value - step <= min) ) {
//                 setValue( min );
//                 return false;
//               }
//               if ( max && (scope.value >= max || scope.value + step >= max) ) {
//                 setValue( max );
//                 return false;
//               }
//               setValue( scope.value );
//             };
//         }
//     };
// });
