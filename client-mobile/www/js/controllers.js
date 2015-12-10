angular.module('digitalDining.controllers', [])

.controller('AppCtrl', ['$state', '$scope', '$http', '$window', function ($state, $scope, $http, $window) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // Form data for the login modal
  $scope.loginData = {};

  $scope.logout = function () {
    if ($window.localStorage.getItem('digitaldining')) {
      $window.localStorage.removeItem('digitaldining');
    }
    $state.go('app');
  };

  $scope.getRestaurants = function () {
    $http({
      method: 'GET',
      url: 'http://localhost:8000/api/users'
    }).then(function (resp) {
      console.log('got response of ', resp);
    }).catch(function (err) {
      console.log('got err: ', err);
    });
  };

  // Perform the login action when the user submits the login form
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
      $state.go('menu.home');
    })
    .catch(function (err) {
      if (err) {
        $scope.loginData.username = '';
        $scope.loginData.password = '';
        $scope.invalidLogin = true;
      }
    });


    //make ajax request to server with $scope.loginData
      //if validated, put the JWT in local storage
      //and route to menu.home
      //if not validated, display error message
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

.controller('HomeCtrl', ['$scope', function ($scope) {
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

  window.navigator.geolocation.getCurrentPosition(onSuccess, onError);

}])

.controller('CheckInCtrl', ['$scope', '$stateParams', function ($scope) {
  $scope.currentWait = '';
  $scope.doCheckIn = function () {
    //add to checked in to restaurant
    //assign table number
    $scope.currentWait = 15 + ' minutes';
    console.log('hit');
  };
}])

.controller('SignUpCtrl', ['$scope', '$state', '$http', '$window', function ($scope, $state, $http, $window) {
  $scope.signupData = {};

  $scope.goToLogin = function () {
  console.log('sign up controller');
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
      $state.go('menu.home');
    })
    .catch(function (err) {
      if (err.status === 409) {
        $scope.invalidUsername = true;
      }
    });
  };
}]);