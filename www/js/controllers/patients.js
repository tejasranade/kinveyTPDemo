angular.module('starter.controllers').controller('PatientCtrl', function($scope, $kinvey) {

    console.log('inside patientctrl');

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

    var patientStore = $kinvey.DataStore.getInstance('Patient',$kinvey.DataStoreType.Network);

    $scope.searchme = function() {
        console.log('inside searchme');

        console.log( $scope.patient.FirstName);
        console.log( $scope.patient.LastName);

        var query = new $kinvey.Query();
    query.equalTo('FirstName',$scope.patient.FirstName)
         .equalTo('LastName',$scope.patient.LastName);
         //.equalTo('DOB',$scope.patient.DOB);
    patientStore.find(query).subscribe(function(models) {
        console.log("subscribe fired "+JSON.stringify(models));
        if (models.length == 1) {
          console.log("updating view");
          $scope.patient = models[0];
          $scope.$digest();
        } else {
          alert("no results found, please specify First, Last, DOB")
        }
    }, function(err) {
      console.log("err "+JSON.stringify(err));
    }, function(res) {
      console.log("subscribe complete");
    });
    }

})


