angular.module('starter.controllers', ['kinvey', 'ngCordova'])

.controller('DashCtrl', function($scope) {

    $scope.myTest = function() {
        console.log('inside myTest');
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('PlacesCtrl', function($kinvey, $scope, $rootScope) {

    console.log('places ctrl');
    $scope.placesData = {
        range: "",
        interest: ""
    };

    $scope.doRefresh = function() {
        console.log('current_loc = ' + $rootScope.current_loc);
        console.log($scope.placesData.range);
        console.log($scope.placesData.interest);
        //console.log( 'range = ' + document.getElementById("myrange").value);
        //console.log( 'interest = ' + document.getElementById("myinterest").value);


        var distance = parseInt($scope.placesData.range);
        console.log('distance = ' + distance);
        var dataStore = $kinvey.DataStore.getInstance('places', $kinvey.DataStoreType.Network);

        var myzone = [$rootScope.current_loc[1], $rootScope.current_loc[0]];

        var query = new $kinvey.Query();
        query.equalTo('keyword', $scope.placesData.interest).near('_geoloc', myzone, distance);
        console.log(query);
        //query.near('_geoloc', $rootScope.current_loc, document.getElementById("myrange"));
        dataStore.find(query).subscribe(function(places) {
            console.log(places);
            $scope.places = places;
            $scope.$digest();
            return;
        });

    }

})


.controller('MapCtrl', function($scope, $kinvey, $rootScope) {
    console.log('mapctrl');
    var gmarkers = [];

    $scope.initialize = function() {

            console.log('initializing map');

            var myLatlng = new google.maps.LatLng(39.8282109, -98.5795706);
            //$scope.mybrand = mybrand;
            var mapOptions = {
                center: myLatlng,
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $rootScope.map = new google.maps.Map(document.getElementById("mymap"),
                mapOptions);
        } // end initialize


    $scope.doRefresh = function() {
            //check to see if a range has been specified
            console.log('refresh');
            if (document.getElementById("myrange").value == "") {
                console.log('no range');
                var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Network);

                dataStore.find().subscribe(function(locations) {
                    console.log(locations);
                    locations = locations.cache;
                    for (var i = 0; i < locations.length; i++) {
                        var mylat = parseInt(locations[i]._geoloc[0]);
                        var mylong = parseInt(locations[i]._geoloc[1]);
                        console.log(mylat + ", " + mylong);
                        console.log(locations[i].company.name);
                        var info = new google.maps.InfoWindow({
                            content: '<b>Who:</b> ' + locations[i].name + '<br><b>Notes:</b> ' + locations[i].company.name
                        });


                        var mapOptions = {

                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var myLatlng = new google.maps.LatLng(mylat, mylong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: $rootScope.map,
                            title: locations[i].name
                        });
                        gmarkers.push(marker);
                        google.maps.event.addListener(marker, 'click', (function(info) {
                            return function() {
                                info.open($rootScope.map, this);
                            }
                        })(info));

                    }

                });
            } else {
                console.log('range specified');
                console.log('gmarker len = ' + gmarkers.length);
                console.log($rootScope.current_loc);

                var myrange = document.getElementById("myrange").value;
                console.log('myrange = ' + myrange);

                console.log('getting position');


                // Query for buildings close by.
                var query = new $kinvey.Query();
                var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Network);
                query.near('_geoloc', $rootScope.current_loc, myrange);
                //debugger;
                var promise = dataStore.find(query).subscribe(function(models) {
                    console.log(models);

                    console.log('num markers = ' + models.length);
                    for (i = 0; i < gmarkers.length; i++) {
                        console.log('clearing marker...');
                        gmarkers[i].setMap(null);
                    }


                    for (var i = 0; i < models.length; i++) {
                        var mylat = parseInt(models[i]._geoloc[0]);
                        var mylong = parseInt(models[i]._geoloc[1]);
                        console.log(mylat + ", " + mylong);
                        console.log(models[i].accountcompany);
                        var info = new google.maps.InfoWindow({
                            content: '<b>Who:</b> ' + models[i].accountname + '<br><b>Notes:</b> ' + models[i].accountcompany
                        });

                        var mapOptions = {
                            //center: myLatlng,
                            //zoom: 3,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var myLatlng = new google.maps.LatLng(mylat, mylong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: $rootScope.map,
                            title: models[i].name
                        });

                        gmarkers.push(marker);

                        google.maps.event.addListener(marker, 'click', (function(info) {
                            return function() {
                                info.open($rootScope.map, this);
                            }
                        })(info));

                    }
                    $scope.$digest();
                    return
                }, function(err) {
                    console.log(err);
                });

            }

        } // end doRefresh

})


.controller('SearchCtrl', function($scope, $kinvey, $sce) {

    $scope.$on('$ionicView.beforeEnter', function() {
        
        var dataStore = $kinvey.DataStore.getInstance('Products');

        dataStore.find().subscribe(function(result) {
            var products = result;
            $scope.products = products;
            $scope.$digest();
        });
    });


    $scope.searchme = function() {
        
        var dataStore = $kinvey.DataStore.getInstance('Products');

        var query = new $kinvey.Query();
        query.equalTo('title', document.getElementById("chosenProduct").value);
        dataStore.find(query).subscribe(function(result) {
            $scope.thisproduct = result;
            $scope.$digest();
            return; 
        });
        
    };
})

.controller('InsertTaskCtrl', function($scope, $kinvey, $ionicLoading) {
    $scope.insertme = function() {
        var mytask = document.getElementById("task").value;
        document.getElementById("task").value = "";
        console.log(mytask);

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

        var dataStore = $kinvey.DataStore.getInstance('tasks', $kinvey.DataStoreType.Sync);

        dataStore.save(data).then(function(result) {
            console.log(result);
            
        }).catch(function(error) {
            console.log(error);
        });
        dataStore.syncCount().then(function (result) {
            console.log(result);
        });
        $ionicLoading.show({
            template: 'task inserted',
            noBackdrop: true,
            duration: 2000
        });

    };
})





.controller('ProductCtrl', function($scope, $kinvey) {

    var dataStore = $kinvey.DataStore.getInstance('Products');

    $scope.$on('$ionicView.beforeEnter', function() {

     
        dataStore.find().subscribe(function(result) {
            var products = result;
            $scope.products = products;
            $scope.$digest();
        });
    });
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



.controller('TasksCtrl', function($scope, $kinvey, $ionicLoading) {

    $scope.doRefresh = function() {
        
        var dataStore = $kinvey.DataStore.getInstance('tasks', $kinvey.DataStoreType.Sync);
        
        dataStore.sync().then(function(result) {
            
            $scope.tasks = result.pull;
            console.log (result);
            $scope.$digest();
            $ionicLoading.show({template: 'sync completed',noBackdrop: true,duration: 2000
        });
            
        }).catch(function(error) {
            console.log(error);
        });
        

    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log("todo load");
        var dataStore = $kinvey.DataStore.getInstance('tasks', $kinvey.DataStoreType.Sync);
        dataStore.find().subscribe(function(result) {
            
            $scope.tasks = result;
            $scope.$digest();

        },function(err) {
            console.log("err "+JSON.stringify(err));
        });

    })
})

.controller('RefCtrl', function($scope, $kinvey) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    $scope.doRefreshRef = function() {
        console.log('ref refresh view');
        var fileStore = new $kinvey.FileStore();
        var query = new $kinvey.Query();
        query.greaterThan('size', 0);
        fileStore.find(query).then(function(files) {
            console.log(files);
            $scope.files = files;
            $scope.$digest();
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('ref load view');

        var fileStore = new $kinvey.FileStore();
        var query = new $kinvey.Query();
        query.greaterThan('size', 0);
        fileStore.find(query).then(function(files) {
            console.log(files);
            $scope.files = files;
            $scope.$digest();
        });
    });
})

.controller('PartnerDetailCtrl', function($scope, $kinvey, $stateParams) {
    console.log('inside partnerdetailctrl');
    console.log($stateParams.partnerId);

    var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Network);

    dataStore.findById($stateParams.partnerId).subscribe(function(result) {
        //var invoices = result;
        console.log(result);
        $scope.invoices = result.invoice;
        $scope.$digest();
        //$scope.$digest();
    });
})

.controller('PartnerCtrl', function($scope, $kinvey) {

    function fetchDoctors() {
        var dataStore = $kinvey.DataStore.getInstance('Doctors', $kinvey.DataStoreType.Network);
        var query = new $kinvey.Query();
        query.equalTo('doctorname', "Bill Russell");
        dataStore.find(query).subscribe(function(result) {
        
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
        var promise = $kinvey.User.login(credentials);
        promise.then(function(user) {
            successHandler()
        }, function(err) {
            errorHandler(err);
        });

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
        
        //MIC
        // var user = new $kinvey.User();
        // user.loginWithMIC('http://localhost:8100', $kinvey.AuthorizationGrant.AuthorizationCodeLoginPage, {
        //     version: 2
        // }).then(function(user) {
        //     $scope.submittedError = false;
        //     return $kinvey.Push.register();

        // }).catch(function(error) {
        //     console.log(error);
        //     return null;
        // }).then(function() {
        //     $state.go('menu.tabs.home');
        // }, function(err) {
        //     $scope.submittedError = true;
        //     $scope.errorDescription = err.description;
        //     $state.go('menu.tabs.account');
        // });   
    };



    $scope.signUp = function() {
        var promise = $kinvey.User.signup({
            username: $scope.userData.email,
            password: $scope.userData.password,
            email: $scope.userData.email
        });
        console.log("signup promise");
        promise.then(
            function() {
                //Kinvey signup finished with success
                $scope.submittedError = false;
                console.log("signup success");
                $state.go('menu.tabs.home');
            },
            function(error) {
                //Kinvey signup finished with error
                $scope.submittedError = true;
                $scope.errorDescription = error.description;
                console.log("signup error: " + error.description);
            }
        );
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