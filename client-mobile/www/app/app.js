// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('digitalDining', ['ionic', 'angularPayments', 'dd-authCtrl', 'dd-authFactory', 'dd-checkInCtrl', 'dd-checkInFactory',
  'dd-restCtrls', 'dd-restFactories', 'dd-payCtrls', 'dd-payFactories', 'dd-homeCtrls', 'dd-homeFactories', 'ngMap'])

.run(function ($ionicPlatform, $ionicConfig) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
    $ionicConfig.views.maxCache(0);
  });
})

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

  //login view.  should probably not be called '/app'.
  .state('app', {
    url: '/app',
    views: {
      '': {
        templateUrl: 'app/auth/login.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('signup', {
    url: '/signup',
    views: {
      '': {
        templateUrl: 'app/auth/signup.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('nav', {
    url: '/nav',
    abstract: true,
    templateUrl: 'app/home/nav.html',
    controller: 'NavCtrl'
  })
  .state('nav.restaurantMenu', {
      url: '/restaurantMenu',
      views: {
        'navContent': {
          templateUrl: 'app/restaurant/restaurantMenu.html',
          controller: 'RestaurantMenuCtrl'
        }
      }
    })
    .state('nav.home', {
      url: '/home',
      views: {
        'navContent': {
          templateUrl: 'app/home/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('nav.checkIn', {
      url: '/checkIn',
      views: {
        'navContent': {
          templateUrl: 'app/checkIn/checkIn.html',
          controller: 'CheckInCtrl'
        }
      }
    })
    .state('nav.currentCheck', {
      url: '/currentCheck',
      views: {
        'navContent': {
          templateUrl: 'app/payment/currentCheck.html',
          controller: 'CheckCtrl'
        }
      }
    })
    .state('nav.account', {
      url: '/account',
      views: {
        'navContent': {
          templateUrl: 'app/payment/account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('nav.menuItemDescription', {
      url: '/menuItemDescription',
      views: {
        'navContent': {
          templateUrl: 'app/restaurant/menuItemDescription.html',
          controller: 'MenuItemDisplayCtrl'
        }
      }
    })
    .state('nav.restaurantDescription', {
      url: '/restaurantDescription',
      views: {
        'navContent': {
          templateUrl: 'app/restaurant/restaurantDescription.html',
          controller: 'RestaurantDisplayCtrl'
        }
      }
  })
  .state('successFBLogin', {
    url: '/successFBLogin',
    views: {
      '': {
      templateUrl: 'app/auth/success.html',
      controller: 'AuthCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
  //run the AttackTokens factor before sending out HTTP requests
  $httpProvider.interceptors.push('AttachTokens');
}]);
