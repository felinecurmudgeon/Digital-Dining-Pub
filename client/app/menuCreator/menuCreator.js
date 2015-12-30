/*jshint camelcase: false */
angular.module('digitalDining.menuCreator', ['digitalDining.menuServices'])

.controller('MenuCtrl', ['$scope', 'Menus', function ($scope, Menus) {
  $scope.menu = {};
  $scope.catToAdd = '';

  $scope.categoryMethods = {
    add: function () {
      Menus.postCategory($scope.catToAdd)
      .then(function (result) {
        $scope.menu[$scope.catToAdd] = {
          items: [],
          catId: result.data.insertId,
          deletable: false,
          editable: false,
          editedName: $scope.catToAdd,
          itemToAdd: {},
          addItemForm: false
        };
        $scope.catToAdd = '';
      });
    },
    delete: function (categoryName, category) {
      if (!category.deletable) {
        category.deletable = true;
      } else {
        Menus.deleteCategory($scope.menu[categoryName].catId).then(function () {
          delete $scope.menu[categoryName];
        });
      }
    },
    edit: function (categoryName, category) {
      category.deletable = false;
      if (!category.editable) {
        category.editable = true;
        category.editedName = categoryName;
      } else {
        Menus.editCategory(category.editedName, category)
        .then(function () {
          $scope.menu[category.editedName] = $scope.menu[categoryName];
          delete $scope.menu[categoryName];
          category.editable = false;
        });
      }
    },
    deleteText: function (category) {
      if (category.deletable) {
        return 'Confirm Delete';
      } else {
        return 'Delete Category';
      }
    },
    editText: function (category) {
      if (category.editable) {
        return 'Save Edit';
      } else {
        return 'Edit Category Name';
      }
    }
  };

  $scope.getMenu = function () {
    $scope.menu = {};

    Menus.getMenuCategories().then(function (dataObject) {
      var categories = dataObject.data.data;
      for (var catIndex = 0; catIndex < categories.length; catIndex++) {
        $scope.menu[categories[catIndex].attributes.category_name] = {
          items: [],
          catId: categories[catIndex].id,
          deletable: false,
          editable: false,
          editedName: categories[catIndex].attributes.category_name,
          itemToAdd: {},
          addItemForm: false
        };
      }
    }).then(function () {
      Menus.getMenuItems().then(function (dataObject) {
        var menuItems = dataObject.data.data;
        for (var itemIndex = 0; itemIndex < menuItems.length; itemIndex++) {
          menuItems[itemIndex].editable = false;
          menuItems[itemIndex].deletable = false;
          menuItems[itemIndex].editedPrice = menuItems[itemIndex].attributes.price;
          menuItems[itemIndex].editedTitle = menuItems[itemIndex].attributes.title;
          menuItems[itemIndex].editedDescription = menuItems[itemIndex].attributes.description;
          $scope.menu[dataObject.data.included[itemIndex].attributes.categoryName].items.push(menuItems[itemIndex]);
        }
      });
    });
  };


  $scope.toggleAddItemForm = function (category) {
    $scope.menu[category].itemToAdd.title = '';
    $scope.menu[category].itemToAdd.description = '';
    $scope.menu[category].itemToAdd.price = '';
    $scope.menu[category].addItemForm = !$scope.menu[category].addItemForm;
  };

  $scope.itemMethods = {
    editText: function (menuItem) {
      if (menuItem.editable) {
        return 'Save Edit';
      } else {
        return 'Edit Item';
      }
    },
    deleteText: function (menuItem) {
      if (menuItem.deletable) {
        return 'Confirm Delete';
      } else {
        return 'Delete Item';
      }
    },
    post: function (category, categoryId) {
      var newItem = {
        attributes: {
          title: $scope.menu[category].itemToAdd.title,
          description: $scope.menu[category].itemToAdd.description,
          price: $scope.menu[category].itemToAdd.price,
          menuCategoryId: categoryId
        },
        editable: false,
        deletable: false,
        editedTitle: $scope.menu[category].itemToAdd.title,
        editedDescription: $scope.menu[category].itemToAdd.description,
        editedPrice: $scope.menu[category].itemToAdd.price
      };
      Menus.postMenuItem(newItem)
      .then(function (result) {
        $scope.toggleAddItemForm(category);
        newItem.id = result.data.insertId;
        $scope.menu[category].items.push(newItem);
      });
    },
    edit: function (menuItem) {
    menuItem.deletable = false;
      if (!menuItem.editable) {
        menuItem.editable = true;
        menuItem.editedPrice = menuItem.attributes.price;
        menuItem.editedTitle = menuItem.attributes.title;
        menuItem.editedDescription = menuItem.attributes.description;
      } else {
        Menus.editMenuItem(menuItem)
        .then(function () {
          menuItem.attributes.price = menuItem.editedPrice;
          menuItem.attributes.title = menuItem.editedTitle;
          menuItem.attributes.description = menuItem.editedDescription;
          menuItem.editable = false;
        });
      }
    },
    delete: function (menuItem, category, index) {
      if (!menuItem.deletable) {
        menuItem.deletable = true;
      } else {
        Menus.deleteMenuItem(menuItem)
        .then(function () {
          $scope.menu[category].items.splice(index, 1);
        });
      }
    }
  };

  $scope.getMenu();
}]);
