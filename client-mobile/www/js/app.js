// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('digitalDining', ['ionic', 'angularPayments', 'digitalDining.controllers', 'digitalDining.services'])

.run(function ($ionicPlatform) {
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
  });
})

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

  //login view.  should probably not be called '/app'.
  .state('app', {
    url: '/app',
    views: {
      '': {
        templateUrl: 'templates/login.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('signup', {
    url: '/signup',
    views: {
      '': {
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl'
      }
    }
  })

  .state('nav', {
    url: '/nav',
    abstract: true,
    templateUrl: 'templates/nav.html',
    controller: 'AppCtrl'
  })

  .state('nav.search', {
    url: '/search',
    views: {
      'navContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('nav.restaurantMenu', {
      url: '/restaurantMenu',
      views: {
        'navContent': {
          templateUrl: 'templates/restaurantMenu.html',
          controller: 'RestaurantMenuCtrl'
        }
      }
    })
    .state('nav.home', {
      url: '/home',
      views: {
        'navContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    }).state('nav.confirmTab', {
      url: '/confirmTab',
      views: {
        'menuContent': {
          templateUrl: 'templates/confirmTab.html',
          controller: 'PaymentsCtrl'
        }
      }
    })
    .state('nav.checkIn', {
      url: '/checkIn',
      views: {
        'navContent': {
          templateUrl: 'templates/checkIn.html',
          controller: 'CheckInCtrl'
        }
      }
    })
    .state('nav.success', {
      url: '/success',
      views: {
        '': {
          templateUrl: 'templates/success.html'
        }
      }
    })
    .state('nav.currentCheck', {
      url: '/currentCheck',
      views: {
        'navContent': {
          templateUrl: 'templates/currentCheck.html'
        }
      }
    })
    .state('nav.account', {
      url: '/account',
      views: {
        'navContent': {
          templateUrl: 'templates/account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('nav.aboutUs', {
      url: '/aboutUs',
      views: {
        'navContent': {
          templateUrl: 'templates/aboutUs.html'
        }
      }
    })
    .state('nav.restaurantDescription', {
      url: '/restaurantDescription',
      views: {
        'navContent': {
          templateUrl: 'templates/restaurantDescription.html',
          controller: 'RestaurantDisplayCtrl'
        }
      }
  })
  .state('successFBLogin', {
    url: '/successFBLogin',
    views: {
      '': {
      templateUrl: 'templates/success.html',
      controller: 'AppCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
  $httpProvider.interceptors.push('AttachTokens');
}]);
