angular.module('digitalDining', [
  'ui.router',
  'ui.bootstrap.dropdown',
  'digitalDining.authServices',
  'digitalDining.auth',
  'digitalDining.restaurantSettings',
  'digitalDining.menuCreator',
  'digitalDining.reservations',
  'digitalDining.kitchen'])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.when('/restaurantSettings', '/restaurantSettings/info');
  $urlRouterProvider.when('/reservations', '/reservations/waiting');
  $urlRouterProvider.otherwise( function ($injector) {
   var $state = $injector.get('$state');
   $state.go('/reservations/waiting');
 });
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: './app/auth/login.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: './app/auth/signup.html',
      controller: 'AuthController'
    })
    .state('kitchen', {
      url: '/kitchen',
      templateUrl: './app/kitchen/kitchen.html',
      controller: 'kitchenController'
    })
    .state('reservations', {
      url: '/reservations',
      templateUrl: './app/reservations/reservationsTemplate.html',
      controller: 'reservationsController'
    })
    .state('reservations.waiting', {
      url: '/waiting',
      templateUrl: './app/reservations/reservationsWaiting.html'
    })
    .state('reservations.current', {
      url: '/current',
      templateUrl: './app/reservations/reservationsCurrent.html'
    })
    .state('menuCreator', {
      url: '/menuCreator',
      templateUrl: './app/menuCreator/menuCreator.html',
      controller: 'MenuCtrl'
    })
    .state('restaurantSettings', {
      url: '/restaurantSettings',
      templateUrl: './app/restaurantSettings/restaurantSettingsTemplate.html',
      controller: 'restSettingsController'
    })
    .state('restaurantSettings.info', {
      url: '/info',
      templateUrl: './app/restaurantSettings/restaurantBasicInfo.html'
    })
    .state('restaurantSettings.description', {
      url: '/description',
      templateUrl: './app/restaurantSettings/restaurantDescription.html'
    })
    .state('restaurantSettings.hours', {
      url: '/hours',
      templateUrl: './app/restaurantSettings/restaurantHours.html'
    })
    .state('restaurantSettings.tables', {
      url: '/tables',
      templateUrl: './app/restaurantSettings/restaurantTables.html'
    })
    .state('pleaseCreate', {
      url: '/pleaseCreate',
      templateUrl: './app/pleaseCreate.html'
    });

  $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.digitalDining');
      if (jwt) {
        object.headers.authorization = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, $state, $window, Auth) {
  $rootScope.$on('$stateChangeStart', function (e, toState) {
    var isLogin = (toState.name === 'login' || toState.name === 'signup');
    if (isLogin) {
      return; // no need to redirect
    }
    var userInfo = Auth.isAuth();
    if (userInfo === false) {
      e.preventDefault(); // stop current execution
      $state.go('login'); // go to login
    } else {
      if (toState.name === 'pleaseCreate' || toState.name === 'restaurantSettings' || toState.name === 'restaurantSettings.info') {
        return;
      }
      if ($window.localStorage.restaurantId === undefined) {
        e.preventDefault(); // stop current execution
        $state.go('pleaseCreate');
      }
    }
    });
});
