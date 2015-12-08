describe('Home Controller', function() {
  beforeEach(module('digitalDining')) 

  var $controller;
  
  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    
  }));
  
  describe('$scope.test', function() {
    it('should be an array', function() {
      var $scope = {};
      var controller = $controller('HomeCtrl', { $scope: $scope });
      expect($scope.test).toEqual([1]);
    });

  })
});

