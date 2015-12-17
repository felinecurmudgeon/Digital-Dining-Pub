angular.module('digitalDining.menuCreator', ['digitalDining.services'])
  
.controller('MenuCtrl', ['$scope', 'MenuFactory', '$http', function ($scope, MenuFactory, $http) {
  $scope.menu = {};
  $scope.itemToAdd = {};
  $scope.addItemForm = {};
  $scope.saveButtonText = 'Edit Item';
  $scope.showAddCat = false;
  $scope.catToAdd = '';

  $scope.addCategory = function () {
    MenuFactory.postCategory($scope.catToAdd)
    .then(function (result) {
      $scope.menu[$scope.catToAdd] = {
        items: [],
        catId: result.data.insertId
      };
      $scope.catToAdd = '';
    });
  };
  
  $scope.getMenu = function () {
    $scope.menu = {}; 

    MenuFactory.getMenuCategories(1).then( function (dataObject) { //the 1 is the hardcoded restaurant ID. Eventually this will be removed.
      for(var catIndex = 0; catIndex < dataObject.data.data.length; catIndex++){
        $scope.menu[dataObject.data.data[catIndex].attributes.category_name] = {
          items: [],
          catId: dataObject.data.data[catIndex].id
        }
        $scope.addItemForm[dataObject.data.data[catIndex].attributes.category_name] = false;
        $scope.itemToAdd[dataObject.data.data[catIndex].attributes.category_name] = false;
      }
    }).then(function(){
      MenuFactory.getMenuItems(1).then(function (dataObject) { //the 1 is the hardcoded restaurant ID. Eventually this will be removed.
        for(var itemIndex = 0; itemIndex < dataObject.data.data.length; itemIndex++){
          dataObject.data.data[itemIndex].editable = false;
          dataObject.data.data[itemIndex].deletable = false;
          dataObject.data.data[itemIndex].editedPrice = dataObject.data.data[itemIndex].attributes.price;
          dataObject.data.data[itemIndex].editedTitle = dataObject.data.data[itemIndex].attributes.title;
          dataObject.data.data[itemIndex].editedDescription = dataObject.data.data[itemIndex].attributes.description;
          $scope.menu[dataObject.data.included[itemIndex].attributes.categoryName].items.push(dataObject.data.data[itemIndex]);         
        };
      });
    });
  };

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
    var newItem = {
      attributes: {
        title: $scope.itemToAdd[category].title,
        description: $scope.itemToAdd[category].description,
        price: $scope.itemToAdd[category].price,
        menuCategoryId: categoryId
      },
      editable: false,
      deletable: false,
      editedTitle: $scope.itemToAdd[category].title,
      editedDescription: $scope.itemToAdd[category].description,
      editedPrice: $scope.itemToAdd[category].price
    };
    MenuFactory.postMenuItem(newItem, categoryId)
    .then(function (result) {
      $scope.toggleAddItemForm(category);
      newItem.id = result.data.insertId;
      $scope.menu[category].items.push(newItem);
    });
  };

  $scope.editItem = function (menuItem) { 
    menuItem.deletable = false;
    if(!menuItem.editable){ 
      menuItem.editable = true;
      menuItem.editedPrice = menuItem.attributes.price;
      menuItem.editedTitle = menuItem.attributes.title;
      menuItem.editedDescription = menuItem.attributes.description;
    } else {
      MenuFactory.editMenuItem(menuItem)
      .then(function (result) {
        menuItem.attributes.price = menuItem.editedPrice;
        menuItem.attributes.title = menuItem.editedTitle;
        menuItem.attributes.description = menuItem.editedDescription;
        menuItem.editable = false;
      });
    }
  };

  $scope.deleteItem = function (menuItem, category, index) {
    if(!menuItem.deletable){
      menuItem.deletable = true;
    } else { 
      MenuFactory.deleteMenuItem(menuItem)
      .then(function (result) {
        $scope.menu[category].items.splice(index, 1);
      })
    }
  }

}]);