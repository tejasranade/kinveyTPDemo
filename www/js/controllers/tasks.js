angular.module('starter.controllers').controller('TasksCtrl', function($scope, $kinvey, $ionicLoading) {

    const dataStore = $kinvey.DataStore.getInstance('Task', $kinvey.DataStoreType.Sync);
    
    function refreshData(newData){
        $scope.tasks = newData;
        $scope.$digest();
    }

    $scope.updateTaskStatus = function(task){
        //save a task
        dataStore.save(task);
    }

    $scope.doSync = function() {
        //sync tasks
        dataStore.sync().then(function(result) {            
            refreshData(result.pull);
        }).catch(function(error) {
            console.log(error);
        });        
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        //get the data to populate this view
        dataStore.pull().then(function (result){
            refreshData(result);
        }, function(err) {
             console.log("err "+JSON.stringify(err));
        });            
        
    })

})
