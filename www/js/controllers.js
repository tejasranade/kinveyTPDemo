angular.module('starter.controllers', ['kinvey', 'ngCordova'])

// twilio 
// AC03d32d0449ef71318aee67eb83598377
// 265b6c1d62ed48ecb104b5512ce16020
// 18573056054

.controller('DashCtrl', function($scope) {

    $scope.myTest = function() {
        console.log('inside myTest');
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('ProductCtrl', function($scope, $kinvey) {

    $scope.$on('$ionicView.beforeEnter', function() {

        var dataStore = $kinvey.DataStore.getInstance('Product');
 
        dataStore.find().subscribe(function(products) {
            $scope.products = products;
            $scope.$digest();
        });
    });
})

.controller('SearchCtrl', function($scope, $kinvey, $sce) {

    $scope.$on('$ionicView.beforeEnter', function() {
        
        var dataStore = $kinvey.DataStore.getInstance('Product');

        dataStore.find().subscribe(function(result) {
            var products = result;
            $scope.products = products;
            $scope.$digest();
        });
    });


    $scope.searchme = function() {
        
        var dataStore = $kinvey.DataStore.getInstance('Product');

        var selection = document.getElementById("chosenProduct").value
        dataStore.find().subscribe(function(result) {
            $scope.thisproduct = result;
            $scope.$digest();
            return; 
        });

        // 'title'
        
        
    };
})


.controller('DoctorsCtrl', function($scope, $kinvey) {

    function fetchDoctors() {
        var dataStore = $kinvey.DataStore.getInstance('Doctor', $kinvey.DataStoreType.Network);
        
        dataStore.find().subscribe(function(result) { 
        
            $scope.doctors = result;
            $scope.$digest();

        }, function(error) {
            console.log(error);
        });


    }
    
    $scope.$on('$ionicView.beforeEnter', fetchDoctors);

    $scope.doRefresh = function() {
        
        fetchDoctors();
    }

})

.controller('InsertTaskCtrl', function($scope, $kinvey, $ionicLoading) {
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

.controller('TasksCtrl', function($scope, $kinvey, $ionicLoading) {

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
        
        dataStore.find().subscribe(function(result) {
            
            $scope.tasks = result;
            $scope.$digest();

        },function(err) {
            console.log("err "+JSON.stringify(err));
        });

    })
})

.controller('PatientCtrl', function($scope, $kinvey) {

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



.controller('BrandCtrl', function($scope, $kinvey) {

    $scope.doRefreshBrand = function() {
        console.log('refresh brand');
        $kinvey.DataStore.find('brand').then(function(mybrand) {
            console.log(mybrand);
            $scope.mybrand = mybrand;
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('partner load view');
        $kinvey.DataStore.find('brand').then(function(brand) {
            console.log(brand);
            $scope.mybrand = brand;
        });
    });

})

.controller('MenuCtrl', function($scope, $kinvey, $ionicSideMenuDelegate, $ionicModal) {
    console.log('inside menuctrl');
    $scope.toggleLeft = function() {
        console.log('inside toggleleft');
        $ionicSideMenuDelegate.toggleLeft();
    };

    $ionicModal.fromTemplateUrl('templates/modal.html', function(modal) {
        $scope.modal = modal;
    }, {
        animation: 'slide-in-up'
    });
})

.controller('HomeCtrl', function($scope, $kinvey, $ionicSideMenuDelegate, $rootScope, $state) {
    console.log('home');

    try {
        navigator.geolocation.getCurrentPosition(function(loc) {
            console.log('getting position');
            var coord = [loc.coords.latitude, loc.coords.longitude];
            console.log(coord);
            $rootScope.current_loc = coord;
        });
    } catch (evt) {
        alert('fail' + evt.message);
    }


    $scope.$on('$ionicView.beforeEnter', function() {
        // we're authenticated, grab logo and color scheme
        console.log('home');
        var activeUser = $kinvey.User.getActiveUser();

        if (!activeUser) {
            // activeUser is null, go to account tab
            $state.go('menu.tabs.account');
            return;
        }
        
        $rootScope.primarycolor = "#D44B2B";
        $rootScope.logo = "img/pharma_background.jpeg";
        $rootScope.screenText = "Medical care in your home, on your schedule.";
        $rootScope.textColor = "#D44B2B";
        $rootScope.customer = "Traveling physician";
        $rootScope.accountsname = "Doctors";
        $rootScope.tasksname = "My Tasks";
        $rootScope.addtaskname = "Add Task";
        $rootScope.calcname = "ROI Calculator";
        $rootScope.productsname = "Products";
        $scope.$digest();
    });

})

.controller('AccountCtrl', function($scope, $state, $kinvey, $cordovaPush, $http) {
    $scope.userData = {
        email: "",
        password: ""
    };

    $scope.validateUser = function() {
        
        var credentials = {username: $scope.userData.email, password: $scope.userData.password};
        // TODO - copy paste here


        function successHandler(user) {
            $scope.submittedError = false;
            console.log('logged in with KinveyAuth2');
            $state.go('menu.tabs.home');
            $kinvey.Push.register();
        }

        function errorHandler(error) {
            console.log("Error login " + error); 

            $scope.submittedError = true;
            $scope.errorDescription = error;

        }

        // var user = new $kinvey.User();
        // var promise = user.login(credentials);
        // promise.then(function(user) {
        //     successHandler();
        // }).catch(function(error) {
        //     errorHandler();
        // });
 
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
            $state.go('menu.tabs.home');
        }, function(err) {
            console.log("error logging in");
            $scope.submittedError = true;
            $scope.errorDescription = err.description;
            console.log(err);
            console.log("Error login " + err.description);
            $state.go('menu.tabs.account');
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