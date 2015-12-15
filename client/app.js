angular.module('digitalDining', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('kitchen', {
            url: '/kitchen',
            templateUrl: 'kitchen.html' // TODO
        })
        .state('reserations', {
            url: '/reserations',
            templateUrl: 'reserations.html' // TODO
        })
        .state('menuCreator', {
            url: '/menuCreator',
            templateUrl: 'menuCreator.html' // TODO
        })
        .state('restaurantSettings', {
            url: '/restaurantSettings',
            templateUrl: 'restaurantSettings.html' // TODO
        });
        
});
