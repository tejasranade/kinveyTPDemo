angular.module('starter.controllers').controller('TasksCtrl', function($scope, $kinvey, $ionicLoading) {
    
    function refreshData(newData){
        $scope.tasks = newData;
        $scope.$digest();
    }

    $scope.doSave = function(task){
        //save a task
        //dataStore.save(task);
    }

    //const dataStore = $kinvey.DataStore.getInstance('Task', $kinvey.DataStoreType.Sync);

    $scope.doSync = function() {
        //sync tasks
        // dataStore.sync().then(function(result) {            
        //     refreshData(result.pull);
        // }).catch(function(error) {
        //     console.log(error);
        // });        
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        //get the data to populate this view
        // dataStore.find().subscribe(function onNext(result){
        //     refreshData(result);
        // }, function(err) {
        //     console.log("err "+JSON.stringify(err));
        // });                    
    })
})
