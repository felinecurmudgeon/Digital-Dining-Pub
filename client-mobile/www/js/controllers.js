angular.module('digitalDining.controllers', [])

//This is currently 'AppCtrl' but really only deals with login -- should probably update naming
.controller('AppCtrl', ['$state', '$scope', '$http', '$window', function ($state, $scope, $http, $window) {

  $scope.loginData = {};

  $scope.logout = function () {
    if ($window.localStorage.getItem('digitaldining')) {
      $window.localStorage.removeItem('digitaldining');
    }
    $state.go('app');
  };

  $scope.doLogin = function () {
    $scope.invalidLogin = false;
    $http({
      method: 'POST',
      url: 'http://localhost:8000/api/signin',
      data: {
        username: $scope.loginData.username,
        password: $scope.loginData.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('digitaldining', resp.data.token);
      $scope.loginData.username = '';
      $scope.loginData.password = '';
      $state.go('nav.home');
    })
    .catch(function (err) {
      if (err) {
        $scope.loginData.username = '';
        $scope.loginData.password = '';
        $scope.invalidLogin = true;
      }
    });
  };

  $scope.signUp = function () {
    $state.go('signup');
  };
}])

.controller('RestaurantMenuCtrl', ['$scope', function ($scope) {
  $scope.menuItemsSample = [
    {name: 'Pizza',
      ingredients: 'Crust, Cheese',
      image: 'https://d2nyfqh3g1stw3.cloudfront.net/photos/pizza_19231.jpg'
    },
    {name: 'Spaghetti',
      ingredients: 'Pasta, Sauce',
      image: 'http://cdn.recipes100.com/v/726fc7d177b8d9598bc7927a21969024.jpg'
    },
    {name: 'Salad',
      ingredients: 'Lettuce, Dressing',
      image: 'http://www.beaconriverterrace.com/Salad1.jpg'
    },
    {name: 'Sushi',
      ingredients: 'Fish, Rice',
      image: 'http://iluvtokyosushi.net/images/home_l.png'
    },
    {name: 'Sandwich',
      ingredients: 'Bread, Meat',
      image: 'http://blogs.plos.org/obesitypanacea/files/2014/10/sandwich.jpg'
    }
  ];
}])

.controller('HomeCtrl', ['$scope', 'HomeFactory' , function ($scope, HomeFactory) {
  $scope.restaurantList = [
  {restaurantName: 'Olive Garden',
    restaurantImg: 'http://i.kinja-img.com/gawker-media/image/upload/sgqboy3tw4sxzqojvkfj.jpg'
  },
  {restaurantName: 'Applebees',
    restaurantImg: 'http://media-cdn.tripadvisor.com/media/photo-s/02/c3/e2/35/applebee-s-loop-410-nw.jpg'
  },
  {restaurantName: "Chili's",
    restaurantImg: 'http://cdn2.moneysavingmom.com/wp-content/uploads/2013/02/Chilis.jpg'
  },
  {restaurantName: "Chevy's",
    restaurantImg: 'http://www.jobapplicationform.us/wp-content/uploads/2014/09/chevys-fresh-mex-job-application-form.jpg'
  },
  {restaurantName: 'Sizzler',
    restaurantImg: 'http://capcityradio.net/b945live/wp-content/uploads/sites/7/2015/04/02Natomas-02.jpg'
  }
  ];

  var onSuccess = function (position) {
    window.alert('Latitude: ' + position.coords.latitude + '\n' +
          'Longitude: ' + position.coords.longitude + '\n' +
          'Altitude: ' + position.coords.altitude + '\n' +
          'Accuracy: ' + position.coords.accuracy + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
          'Heading: ' + position.coords.heading + '\n' +
          'Speed: ' + position.coords.speed + '\n' +
          'Timestamp: ' + position.timestamp + '\n');
  };

  var onError = function (error) {
    window.alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
  };

  // window.navigator.geolocation.getCurrentPosition(onSuccess, onError);

  $scope.displayRestaurants = function () {
    HomeFactory.getAllRestaurants().then(function (restaurants) {
      console.log('here', restaurants);
      $scope.restaurants = restaurants;
    });
  };
  $scope.displayRestaurants();
  $scope.test = [1];

  $scope.focusRestaurant = function(rest) {
    HomeFactory.focusRestaurant(rest);
  };
}])

.controller('CheckInCtrl', ['$scope', '$stateParams', function ($scope) {
  $scope.currentWait = '';
  $scope.doCheckIn = function () {
    //add to checked in to restaurant
    //assign table number
    $scope.currentWait = 15 + ' minutes';
  };
}])
.controller('SignUpCtrl', ['$scope', '$state', '$http', '$window', function ($scope, $state, $http, $window) {
  $scope.signupData = {};

  $scope.goToLogin = function () {
    $state.go('app');
  };

  $scope.doSignUp = function () {
    $http({
      method: 'POST',
      url: 'http://localhost:8000/api/signup',
      data: {
        username: $scope.signupData.username,
        password: $scope.signupData.password
      }
    })
    .then(function (resp) {
      $window.localStorage.setItem('digitaldining', resp.data.token);
      $state.go('nav.home');
    })
    .catch(function (err) {
      if (err.status === 409) {
        $scope.invalidUsername = true;
      }
    });
  };
}])
.controller('RestaurantDisplayCtrl', ['$scope', 'HomeFactory',  function ($scope, HomeFactory) {
  $scope.focusedRestaurant = {};
  $scope.getFocusedRestaurant = function () {
    $scope.focusedRestaurant = HomeFactory.getFocusedRestaurant();
  };
  $scope.getFocusedRestaurant();
}])
.controller('PaymentsCtrl', ['$scope', function ($scope) {
  $scope.testingTotalForTaxAndTip = 140;
  $scope.totalWithTax = 0;
  $scope.taxAmount = 0;
  $scope.totalWithTaxAndTip = 0;
  $scope.taxCalculator = function (total) {
    $scope.taxAmount = total * 0.08;
    $scope.totalWithTax = total + $scope.taxAmount;
  };
  $scope.tipCalculator = function (total, percentage) {
    $scope.tipAmount = total * percentage;
    $scope.totalWithTaxAndTip = total + $scope.tipAmount;
  };
}]);

