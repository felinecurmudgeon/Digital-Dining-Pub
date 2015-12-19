angular.module('digitalDining', [
  'ui.router',
  'digitalDining.services',
  'digitalDining.auth',
  'digitalDining.restaurantSettings',
  'digitalDining.menuCreator'])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.when('/restaurantSettings', '/restaurantSettings/info');
  $urlRouterProvider.otherwise('/reservations');
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
      templateUrl: './app/dummy.html' // TODO add controller
    })
    .state('reservations', {
      url: '/reservations',
      templateUrl: './app/dummy.html' // TODO
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
.run(function ($rootScope, $location, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function (e, toState) {
        var isLogin = (toState.name === 'login' || toState.name === 'signup');
        if (isLogin) {
           return; // no need to redirect
        }
        var userInfo = Auth.isAuth();
        if (userInfo === false) {
            e.preventDefault(); // stop current execution
            $state.go('login'); // go to login
        }
    });
});
