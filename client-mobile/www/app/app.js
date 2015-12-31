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
    //switch to turn on/off relative paths for api endpoints - make false to use ionic upload, otherwise true
    window.isMobileDev = true;

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
  // without the anonymous function passed to .otherwise, we get an 'infinite'
  // redirect loop.  This is a quirky angular interaction b/w .otherwise and $stateChangeStart
  $urlRouterProvider.otherwise( function ($injector) {
    var $state = $injector.get('$state');
    $state.go('nav.home');
  });
  //run the AttachTokens factor before sending out HTTP requests
  $httpProvider.interceptors.push('AttachTokens');
}])
.run(function ($rootScope, $location, $state, AuthFactory) {
    $rootScope.$on('$stateChangeStart', function (e, toState) {
        var isLogin = (toState.name === 'app' || toState.name === 'signup' || toState.name === 'successFBLogin');
        if (isLogin) {
           return; // no need to redirect
        }
        var userInfo = AuthFactory.isAuth();
        if (userInfo === false) {
            e.preventDefault(); // stop current execution
            $state.go('app'); // go to login
        }
    });
});
