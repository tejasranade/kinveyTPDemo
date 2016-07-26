angular.module('starter.controllers').controller('ProductCtrl', function($scope, $kinvey) {

    $scope.$on('$ionicView.beforeEnter', function() {

        var dataStore = $kinvey.DataStore.getInstance('Product');
 
        dataStore.find().subscribe(function(products) {
            $scope.products = products;
            $scope.$digest();
        });
    });
})
