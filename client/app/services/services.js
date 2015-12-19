angular.module('digitalDining.services', [])

.factory('Auth', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };
  var isAuth = function () {
    return !!$window.localStorage.getItem('com.digitalDining');
  };
  var signout = function () {
    $window.localStorage.removeItem('com.digitalDining');
    $location.path('/signin');
  };
  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
})

.factory('Restaurants', function ($http) {
  var getRestaurantInfo = function () {
    return $http({
      method: 'GET',
      url: '/api/restaurants?all=false'
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err) {
      return err;
    });
  };
  var createRestaurant = function (restaurant) {
    return $http({
      method: 'POST',
      url: '/api/restaurants',
      data: restaurant
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err) {
      return err;
    });
  };
  var updateRestaurant = function (restaurant) {
    return $http({
      method: 'PUT',
      url: '/api/restaurants/' + restaurant.id,
      data: restaurant
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err) {
      return err;
    });
  };
  return {
    getRestaurantInfo: getRestaurantInfo,
    createRestaurant: createRestaurant,
    updateRestaurant: updateRestaurant
  };
})

.factory('MenuFactory', ['$http', function ($http) {
  var getMenuItems = function (restID) {
    return $http({
      url: 'http://localhost:8000/api/menuitems/?rid=' + restID,
      method: 'GET'
    });
  };

  var getMenuCategories = function (restID) {
    return $http({
      url: 'http://localhost:8000/api/menuCategories/?rid=' + restID,
      method: 'GET'
    });
  };

  var postMenuItem = function (menuItem) {
    return $http({
      url: 'http://localhost:8000/api/menuItems',
      method: 'POST',
      data: {
        'restaurant_id' : 1, //ultimately this will be communicated in the JWT
        'title' : menuItem.attributes.title,
        'description' : menuItem.attributes.description,
        'price' : menuItem.attributes.price,
        'menu_category_id' : menuItem.attributes.menuCategoryId
      }
    });
  };

  var editMenuItem = function (menuItem) {
    return $http({
      url: 'http://localhost:8000/api/menuItems/' + menuItem.id,
      method: 'PUT',
      data: {
        'restaurant_id' : 1, //ultimately this will be communicated in the JWT
        'title' : menuItem.editedTitle,
        'description' : menuItem.editedDescription,
        'price' : menuItem.editedPrice,
        'menu_category_id' : menuItem.attributes.menuCategoryId
      }
    });
  };

  var deleteMenuItem = function (menuItem) {
    return $http({
      url: 'http://localhost:8000/api/menuItems/' + menuItem.id,
      method: 'DELETE'
    });
  };

  var postCategory = function (category) {
    return $http({
      url: 'http://localhost:8000/api/menuCategories',
      method: 'POST',
      data: {
        'restaurant_id' : 1, //ultimately this will be communicated in the JWT
        'category_name' : category
      }
    });
  };

  var deleteCategory = function (categoryId) {
    return $http({
      url: 'http://localhost:8000/api/menuCategories/' + categoryId,
      method: 'DELETE'
    });
  };

  var editCategory = function (categoryName, category) {
    return $http({
      url: 'http://localhost:8000/api/menuCategories/' + category.catId,
      method: 'PUT',
      data: {
        'category_name': categoryName
      }
    });
  };

  return {
    editCategory: editCategory,
    deleteCategory: deleteCategory,
    postCategory: postCategory,
    deleteMenuItem: deleteMenuItem,
    editMenuItem: editMenuItem,
    getMenuCategories: getMenuCategories,
    getMenuItems: getMenuItems,
    postMenuItem: postMenuItem
  };
}]);

