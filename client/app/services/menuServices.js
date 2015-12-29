angular.module('digitalDining.menuServices', [])

.factory('Menus', ['$http', '$window', function ($http, $window) {
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
}]);
