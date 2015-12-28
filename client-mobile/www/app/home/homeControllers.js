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
  var getLocation = function (cb) {
      var onSuccess = function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        cb([lat, lng]);
      };
      var onError = function (error) {
        console.log('code: ' + error.code + '\n' +
              'message: ' + error.message + '\n');
        cb(error.message);
      };
      window.navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  var distance = function (x1, y1, x2, y2) {
    var xlen = 0;
    var ylen = 0;

    if (x1 > x2) {
      xlen = x1 - x2;
    } else {
      xlen = x2 - x1;
    }
    if (y1 > y2) {
      ylen = y1 - y2;
    } else {
      ylen = y2 - y1;
    }

    ylen = (ylen * 110.574) * 0.62137119;
    xlen = (xlen * (111.320 * Math.cos(y1 - ylen)) * 0.62137119);

    return Math.sqrt(Math.pow(xlen, 2) + Math.pow(ylen, 2));
  };

  $scope.displayRestaurants = function () {
    HomeFactory.getAllRestaurants().then(function (restaurants) {
    // uncomment this line and comment out everything else in this function to turn off the geo location
    //$scope.restaurants = restaurants.data.data;
      getLocation(function (latLng) {
        //lookup coords for each rest via google maps
        restaurants.data.data.forEach(function (restaurant) {
          var address = restaurant.attributes.restaurantAddress + ',' + restaurant.attributes.restaurantCity + ',' + restaurant.attributes.restaurantState;
          HomeFactory.convertAddress(address)
            .then(function (mapResult) {
              //run through distance function and append distance to restaurants.data.data
              restaurant.attributes.distance = distance(mapResult.data.results[0].geometry.location.lat, mapResult.data.results[0].geometry.location.lng, latLng[0], latLng[1]);
                 $scope.restaurants = restaurants.data.data;
            });
        });
     });
    });

  };
  $scope.displayRestaurants();

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
