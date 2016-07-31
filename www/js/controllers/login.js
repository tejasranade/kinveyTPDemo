angular.module('starter.controllers').controller('LoginCtrl', function($scope, $state, $kinvey, $cordovaPush, $http) {
    
    $scope.userData = {
        email: "",
        password: ""
    };

    function onSuccess(user) {
        $scope.submittedError = false;
        console.log(user);
        $state.go('menu.home');
    }

    function onError(error) {
        console.log("Error login " + error); 

        $scope.submittedError = true;
        $scope.errorDescription = error;        
    }

    $scope.validateUser = function() {

        const username = $scope.userData.email;
        const password = $scope.userData.password;

        //Log a user into Kinvey
        var promise = $kinvey.User.login(username, password);
        promise.then(function(user) {
          onSuccess(user);
        }).catch(function(error) {
          onError(error);
        });
    };

    $scope.validateUserMIC = function() {

        // var user = new $kinvey.User();
        // user.loginWithMIC('http://localhost:8100', $kinvey.AuthorizationGrant.AuthorizationCodeLoginPage, {
        //     version: 2
        // }).then(function(user) {
        //     onSuccess(user);        
        // }).catch(function(error) {
        //     onError(error);
        // });
    };


    $scope.logout = function() {
        console.log('logout user');
        //Kinvey logout starts
        // var user = $kinvey.User.getActiveUser();
        // if (user) {
        //     return user.logout().catch(function(error) {
        //         //Kinvey logout finished with error
        //         alert("Error logout: " + JSON.stringify(error));
        //     });
        // }

    }

});