angular.module('starter.controllers').controller('InsertTaskCtrl', function($scope, $kinvey, $ionicLoading) {
    
    function render(result){
        const resultArr = [].concat(result);
        $ionicLoading.show({template:'' + resultArr.length + ' task(s) inserted',
            noBackdrop: true,
            duration: 2000});            
    }

    $scope.autoCreate = function (n) {
        var tasks = [];
        for (var i = 0; i < n; i++) {
            const task = {
                "Title": "Sample Task" + i,
                "action" : "Sample Action" + i,
                "priority": "Normal",
                "status": "active"
            }
            tasks.push(task);
        }
        saveToStore(tasks);
    }

    $scope.insert = function() {
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


        var data = {
            "action": mytask,
            "duedate": myduedate,
            "status": status,
            "class": "personal",
            "Title": "Personal Task"
        };

        saveToStore(data);

    };

    
    var dataStore = $kinvey.DataStore.getInstance('Task', $kinvey.DataStoreType.Sync);
    
    function saveToStore(data){
        //save the task to the store
        dataStore.save(data).then(function(result) {
            render(result);
        }).catch(function(error) {
            console.log(error);
        });
    }
})
