angular.module('digitalDining.menuCreator', ['digitalDining.services'])
  
.controller('MenuCtrl', ['$scope', 'MenuFactory', '$http', function ($scope, MenuFactory, $http) {
  $scope.menu = {};
  $scope.itemToAdd = {};
  $scope.addItemForm = {};
  $scope.saveButtonText = 'Edit Item';
  $scope.showAddCat = false;
  $scope.catToAdd = '';

  $scope.addCategory = function () {
    $http({
      url: 'http://localhost:8000/api/menuCategories',
      method: 'POST',
      data: {
        'restaurant_id' : 1, //ultimately this will be communicated in the JWT
        'category_name' : $scope.catToAdd
      }
    }).then(function(result){
      console.log('success! result: ', result);
      $scope.catToAdd = '';
      $scope.getMenu();
    });
  }

  $scope.getMenu = function () {
    //TODO: need to get and add all categories (including empty ones)
    //right now, calls to restaurant menu API gives all categories.  Waiting for this to take an ID parameter before implementing

    // MenuFactory.getMenuCategories(1).then( function (dataObject) {
    //   console.log('categories object = ', dataObject);
    // })
    MenuFactory.getMenuItems(1).then(function (dataObject) {
      $scope.menu = {};
      console.log('got menu: ', dataObject);
      for(var itemIndex = 0; itemIndex < dataObject.data.data.length; itemIndex++){
        dataObject.data.data[itemIndex].editable = false;
        dataObject.data.data[itemIndex].deletable = false;
          if (!$scope.menu[dataObject.data.included[itemIndex].attributes.categoryName]) {
          $scope.menu[dataObject.data.included[itemIndex].attributes.categoryName] = {
            items: [dataObject.data.data[itemIndex]],
            catId: dataObject.data.included[itemIndex].id
          };
          $scope.addItemForm[dataObject.data.included[itemIndex].attributes.categoryName] = false;
          $scope.itemToAdd[dataObject.data.included[itemIndex].attributes.categoryName] = false;
        } else {
          $scope.menu[dataObject.data.included[itemIndex].attributes.categoryName].items.push(dataObject.data.data[itemIndex]);         
        }
        console.log($scope.menu);
      };
    });
  }

  $scope.getMenu();

  $scope.toggleAddItemForm = function (category) {
    $scope.itemToAdd[category].title = '';
    $scope.itemToAdd[category].description = '';
    $scope.itemToAdd[category].price = '';
    $scope.addItemForm[category] = !$scope.addItemForm[category];
  }

  $scope.editText = function(menuItem){
    if(menuItem.editable){
      return 'Save Edit';
    } else {
      return 'Edit Item';
    }
  }

  $scope.deleteText = function (menuItem) {
    if(menuItem.deletable){
      return 'Confirm Delete';
    } else {
      return 'Delete Item';
    }
  }

  $scope.postNewItem = function (category, categoryId) {
    console.log('categoryID = ' + categoryId)
    $http({
          url: 'http://localhost:8000/api/menuItems',
          method: 'POST',
          data: {
            'restaurant_id' : 1, //ultimately this will be communicated in the JWT
            'title' : $scope.itemToAdd[category].title,
            'description' : $scope.itemToAdd[category].description,
            'price' : $scope.itemToAdd[category].price,
            'menu_category_id' : categoryId
          }
        }).then(function(result){
          console.log('success! result: ', result);
          $scope.toggleAddItemForm(category);
          $scope.getMenu();
        });
  };

  $scope.editItem = function (menuItem) { //Need to implement this once I get menu item IDs
    menuItem.deletable = false;
    if(!menuItem.editable){ //will need to bind data to the input fields on the DOM
      menuItem.editable = true;
    } else {
      // $http({
      //     url: 'http://localhost:8000/api/menuItems/' + menuItem.id,
      //     method: 'PUT',
      //     data: {
      //       'restaurant_id' : 1, //ultimately this will be communicated in the JWT
      //       'title' : $scope.itemToAdd[category].title,
      //       'description' : $scope.itemToAdd[category].description,
      //       'price' : $scope.itemToAdd[category].price,
      //       'menu_category_id' : categoryId
      //     }
      //   }).then(function(result){
      //     console.log('success! result: ', result);
      //     $scope.toggleAddItemForm(category);
      //     $scope.getMenuItems();
      //   });
      menuItem.editable = false;
    }
  };

  $scope.deleteItem = function (menuItem) {
    if(!menuItem.deletable){
      menuItem.deletable = true;
    } else { //need to implement this once we get menu item IDs
      
    }
  }

}]);