angular.module('starter.controllers').controller('LoginCtrl', function($scope, $state, $kinvey, $cordovaPush, $http) {
    
    $scope.userData = {
        email: "",
        password: ""
    };

    $scope.validateUser = function() {
        console.log ("logging in user");
        
        const username = $scope.userData.email;
        const password = $scope.userData.password;
        //var credentials = {username: $scope.userData.email, password: $scope.userData.password};

        //Log a user into Kinvey
        var promise = $kinvey.User.login(username, password);
        promise.then(function(user) {
          successHandler(user);
        }).catch(function(error) {
          errorHandler(error);
        });


        function successHandler(user) {
            $scope.submittedError = false;
            console.log('logged in with KinveyAuth2');
            $state.go('menu.home');
        }

        function errorHandler(error) {
            console.log("Error login " + error); 

            $scope.submittedError = true;
            $scope.errorDescription = error;

        }
 
    };

    $scope.validateUserMIC = function() {
        
        var user = new $kinvey.User();
        user.loginWithMIC('http://localhost:8100', $kinvey.AuthorizationGrant.AuthorizationCodeLoginPage, {
            version: 2
        }).then(function(user) {
            
            $scope.submittedError = false;
            console.log(user);
            return $kinvey.Push.register();

        }).catch(function(error) {
            console.log(error);
            return null;
        }).then(function() {
            $state.go('menu.home');
        }, function(err) {
            console.log("error logging in");
            $scope.submittedError = true;
            $scope.errorDescription = err.description;
            console.log(err);
            console.log("Error login " + err.description);
            $state.go('menu.logout');
        });

    };


    $scope.logout = function() {
        console.log('logout user');
        //Kinvey logout starts
        var user = $kinvey.User.getActiveUser();
        if (user) {
            return user.logout().catch(function(error) {
                //Kinvey logout finished with error
                alert("Error logout: " + JSON.stringify(error));
            });
        }

    }

});