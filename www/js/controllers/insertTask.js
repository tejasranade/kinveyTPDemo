angular.module('starter.controllers').controller('InsertTaskCtrl', function($scope, $kinvey, $ionicLoading) {
    
    var dataStore = $kinvey.DataStore.getInstance('Task', $kinvey.DataStoreType.Sync);

    function showCompletedMessage(){
        $ionicLoading.show({template: 'task inserted',noBackdrop: true,duration: 2000});            
    }

    $scope.insertme = function() {
        var mytask = document.getElementById("task").value;
        document.getElementById("task").value = "";
        
        var myduedate = document.getElementById("duedate").value;
        console.log(duedate);
        document.getElementById("duedate").value = "";

        var mystatus = document.getElementById("completed").checked;
        console.log(mystatus);

        var status = "active";
        if (mystatus == true) {
            status = "complete";
        } else {
            status = false;
        }


        var data = {};

        data.action = mytask;
        data.duedate = myduedate;
        data.status = status;
        data.class = "personal";
        data.Title = "Personal Task";
        console.log(JSON.stringify(data));

        saveToStore(data);

    };

    function saveToStore(task){
        //save the task to the store
        dataStore.save(task).then(function(result) {
            showCompletedMessage();
        }).catch(function(error) {
            console.log(error);
        });

    }
})
