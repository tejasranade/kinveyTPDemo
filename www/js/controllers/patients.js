angular.module('starter.controllers').controller('PatientCtrl', function($scope, $kinvey) {

    $scope.patient = {
        _id: "",
        MaritalStatus: "",
        FirstName: "",
        LastName: "",
        DOB: "",
        Nickname: "",
        SSN: "",
        Sex: ""
    };

    function render(data){
      if (data.length == 1) {
        console.log("updating view");
        $scope.patient = data[0];
        $scope.$digest();
      } else {
        alert("no results found, please specify First, Last, DOB")
      }
    }

    $scope.search = function(firstName, lastName) {      
      //Build Kinvey query for the patient and execute it on the store
      var patientStore = $kinvey.DataStore.getInstance('Patient',$kinvey.DataStoreType.Network);
      var query = new $kinvey.Query();

      query.equalTo('FirstName', firstName)
           .equalTo('LastName', lastName);

      patientStore.find(query).subscribe(function(models) {          
          render(models);
      }, function(err) {
        console.log("err "+JSON.stringify(err));
      }, function(res) {
        console.log("subscribe complete");
      });
    }

})


