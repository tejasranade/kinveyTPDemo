angular.module('starter.controllers').controller('TasksCtrl', function($scope, $kinvey, $ionicLoading) {

    $scope.doRefresh = function() {
        
        var dataStore = $kinvey.DataStore.getInstance('Task', $kinvey.DataStoreType.Sync);
        
        dataStore.sync().then(function(result) {
            
            $scope.tasks = result.pull;
            console.log (result);
            $scope.$digest();
            $ionicLoading.show({template: 'sync completed',noBackdrop: true,duration: 2000
        }).catch(function(error) {
            console.log(error);
        });
        })
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        
        var dataStore = $kinvey.DataStore.getInstance('Task', $kinvey.DataStoreType.Sync);
        dataStore.pull().then(function (result){
            $scope.tasks = result;
            $scope.$digest();
        }, function(err) {
             console.log("err "+JSON.stringify(err));
        });

    })
})
