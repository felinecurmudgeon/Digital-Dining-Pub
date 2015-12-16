angular.module('digitalDining', [
  'ui.router',
  'digitalDining.services',
  'digitalDining.auth'])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/reserations');
  $stateProvider
    .state('login', {
      url:'/login',
      templateUrl: './app/auth/login.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url:'/signup',
      templateUrl: './app/auth/signup.html',
      controller: 'AuthController'
    })
    .state('kitchen', {
      url: '/kitchen',
      templateUrl: './app/dummy.html' // TODO add controller
    })
    .state('reserations', {
      url: '/reserations',
      templateUrl: './app/dummy.html' // TODO
    })
    .state('menuCreator', {
      url: '/menuCreator',
      templateUrl: './app/dummy.html' // TODO
    })
    .state('restaurantSettings', {
      url: '/restaurantSettings',
      templateUrl: './app/dummy.html' // TODO
    });
})

.run(function($rootScope, $location, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function (e, toState  , toParams, fromState, fromParams) {
        var isLogin = (toState.name === 'login' || toState.name === 'signup');
        if(isLogin){
           return; // no need to redirect 
        }
        var userInfo = Auth.isAuth();
        if(userInfo === false) {
            e.preventDefault(); // stop current execution
            $state.go('login'); // go to login
        }
    });
});
