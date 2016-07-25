angular.module('starter.controllers').controller('DoctorsCtrl', function($scope, $kinvey) {

    function fetchDoctors() {
        var dataStore = $kinvey.DataStore.getInstance('Doctor', $kinvey.DataStoreType.Network);
        
        dataStore.find().subscribe(function(result) { 
        
            $scope.doctors = result;
            $scope.$digest();

        }, function(error) {
            console.log(error);
        });
    }

    $scope.$on('$ionicView.beforeEnter', fetchDoctors);

    $scope.doRefresh = function() {
        
        fetchDoctors();
    }

});
