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

.factory('MenuFactory', ['$http', '$window', function ($http, $window) {
  var getMenuItems = function () {
    return $http({
      url: 'http://localhost:8000/api/menuitems/?rid=' + $window.localStorage.getItem('restaurantId'),
      method: 'GET'
    });
  };
  var getMenuCategories = function () {
    return $http({
      url: 'http://localhost:8000/api/menuCategories/?rid=' + $window.localStorage.getItem('restaurantId'),
      method: 'GET'
    });
  };
  var postMenuItem = function (menuItem) {
    console.log($window.localStorage.getItem('restaurantId') + ' is the restaurant Id');
    return $http({
      url: 'http://localhost:8000/api/menuItems',
      method: 'POST',
      data: {
        'restaurant_id' : $window.localStorage.getItem('restaurantId'),
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
        'restaurant_id' : $window.localStorage.getItem('restaurantId'),
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
        'restaurant_id' : $window.localStorage.getItem('restaurantId'),
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
}])

.factory('Reservations', function ($http, $window) {
  var getCheckedInParties = function () {
    return $http({
      method: 'GET',
      url: '/api/parties?rid=' + $window.localStorage.getItem('restaurantId') + '&status=waiting'
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  var getSeatedParties = function () {
    return $http({
      method: 'GET',
      url: '/api/parties?rid=' + $window.localStorage.getItem('restaurantId') + '&status=seated'
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  return {
    getCheckedInParties: getCheckedInParties,
    getSeatedParties: getSeatedParties
  };
})

.factory('Tables', function ($http, $window) {
  var getTables = function () {
    return $http({
      method: 'GET',
      url: '/api/tables?rid=' + $window.localStorage.getItem('restaurantId')
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  var postTable = function (newTable) {
    return $http({
      url: 'http://localhost:8000/api/tables',
      method: 'POST',
      data: {
        'restaurant_id': $window.localStorage.getItem('restaurantId'),
        'table_number': +newTable.tableNumber,
        'seats': newTable.seats
      }
    });
  };
  return {
    getTables: getTables,
    postTable: postTable
  };
});
