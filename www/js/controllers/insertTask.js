angular.module('starter.controllers').controller('InsertTaskCtrl', function($scope, $kinvey, $ionicLoading) {
    
    $scope.insertme = function() {
        var mytask = document.getElementById("task").value;
        document.getElementById("task").value = "";
        
        var myduedate = document.getElementById("duedate").value;
        console.log(duedate);
        document.getElementById("duedate").value = "";



        var mycomplete = document.getElementById("completed").checked;
        console.log(mycomplete);

        var complete = false;
        if (mycomplete == true) {
            complete = true;
        } else {
            complete = false;
        }


        var data = {};

        data.action = mytask;
        data.duedate = myduedate;
        data.completed = complete;
        data.class = "personal";
        data.Title = "Personal Task";
        console.log(JSON.stringify(data));

        var dataStore = $kinvey.DataStore.getInstance('Task', $kinvey.DataStoreType.Sync);

        dataStore.save(data).then(function(result) {
            $ionicLoading.show({template: 'task inserted',noBackdrop: true,duration: 2000});
            
        }).catch(function(error) {
            console.log(error);
        });
    };
})
