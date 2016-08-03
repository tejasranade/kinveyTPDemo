angular.module('starter.controllers').controller('DoctorsCtrl', function($scope, $kinvey) {

    function render(data){
        $scope.doctors = data;
        $scope.$digest();
    }

    function fetchDoctors() {
        //get doctors from the backend
        // var dataStore = $kinvey.DataStore.getInstance('Doctor', $kinvey.DataStoreType.Cache);
        
        // dataStore.find().subscribe(function(result) { 
        //     render(result);        
        // }, function(error) {
        //     console.log(error);
        // });
    }

    $scope.$on('$ionicView.beforeEnter', fetchDoctors);

    $scope.doRefresh = function() {
        fetchDoctors();
    }
    
});
