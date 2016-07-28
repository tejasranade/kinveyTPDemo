angular.module('starter.controllers', ['kinvey', 'ngCordova'])

// jikku's twilio 
// ACa22283862df085181d5799358348ccba
// 82e6dddd386152148bd7ef44587faa88
// 18573056054

.controller('DashCtrl', function($scope) {

    $scope.myTest = function() {
        console.log('inside myTest');
        $ionicSideMenuDelegate.toggleLeft();
    };
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
            $state.go('menu.account');
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


.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $kinvey, $ionicPopover) {
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
    var currentLocationLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: currentLocationLatLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    // Create a map
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
        var currentLocationIcon = {
            url: './img/current_position.png',
            size: new google.maps.Size(60, 60),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(30, 30)
        };

        var currentLocationMarker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: currentLocationLatLng,
            icon: currentLocationIcon
        });

        var infoWindow = new google.maps.InfoWindow({
            content: 'Your location'
        });

        // Listen for a click event on the current location marker
        google.maps.event.addListener(currentLocationMarker, 'click', function() {
            infoWindow.open($scope.map, currentLocationMarker);
        });

        var busMarkers = {};
        var store = $kinvey.DataStore.collection('Bus');

        store.find().subscribe(function(buses){
            buses.forEach (function (bus) {
                var busMarker = busMarkers[bus._id];
                var latitude = bus.location[1];
                var longitude = bus.location[0];
                var busLatLng = new google.maps.LatLng(latitude, longitude);

                if (!busMarker){
                    //create a bus marker
                    busMarker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: busLatLng
                    });
                    busMarkers[bus._id] = busMarker;

                    var infoWindow = new google.maps.InfoWindow({
                        content: bus.name
                    });

                    google.maps.event.addListener(busMarker, 'click', function(){
                        infoWindow.open($scope.map, busMarker);
                    });
                }

                busMarker.setPosition(busLatLng);

            });

        });

      // store.find().then(function(response) {
      //   var buses = response.cache;
      //   buses.forEach(function(bus) {
      //     var busMarker = busMarkers[bus._id];
      //     var latitude = bus.location[1];
      //     var longitude = bus.location[0];
      //     var busLatLng = new google.maps.LatLng(latitude, longitude);

      //     if (!busMarker) {
      //       // Create a bus marker
      //       busMarker = new google.maps.Marker({
      //         map: $scope.map,
      //         animation: google.maps.Animation.DROP,
      //         position: busLatLng
      //       });
      //       busMarkers[bus._id] = busMarker;

      //       var infoWindow = new google.maps.InfoWindow({
      //         content: bus.name
      //       });

      //       // Listen for a click event on the bus marker
      //       google.maps.event.addListener(busMarker, 'click', function() {
      //         infoWindow.open($scope.map, busMarker);
      //       });
      //     }

      //     busMarker.setPosition(busLatLng);
      //   });

      //   return response.networkPromise;
      // }).then(function(buses) {
      //   console.log(buses);
      //   buses.forEach(function(bus) {
      //     var busMarker = busMarkers[bus._id];
      //     var latitude = bus.location[1];
      //     var longitude = bus.location[0];
      //     var busLatLng = new google.maps.LatLng(latitude, longitude);

      //     if (!busMarker) {
      //       // Create a bus marker
      //       busMarker = new google.maps.Marker({
      //         map: $scope.map,
      //         animation: google.maps.Animation.DROP,
      //         position: busLatLng
      //       });
      //       busMarkers[bus._id] = busMarker;

      //       var infoWindow = new google.maps.InfoWindow({
      //         content: bus.name
      //       });

      //       // Listen for a click event on the bus marker
      //       google.maps.event.addListener(busMarker, 'click', function() {
      //         infoWindow.open($scope.map, busMarker);
      //       });
      //     }

      //     busMarker.setPosition(busLatLng);
      //   });

      //   // Subscribe for updates to the buses
      //   return store.subscribe();
      // }).then(function(subscription) {
      //   console.log('Subscription url: ' + subscription.url);
      //   console.log('Subscription readyState: ' + subscription.readyState);

      //   subscription.onerror = function(error) {
      //     console.log(error);
      //   };

      //   subscription.onopen = function(data) {
      //     console.log('Subscription is open.');
      //   };

      //   subscription.onmessage = function(message) {
      //     console.log('Received message', message);

      //     try {
      //       var data = JSON.parse(message.data);
      //       var op = data.op;
      //       var bus = data.data;

      //       if (op ==='update' && bus) {
      //         var busMarker = busMarkers[bus._id];

      //         if (busMarker) {
      //           var latitude = bus.location[1];
      //           var longitude = bus.location[0];
      //           var busLatLng = new google.maps.LatLng(latitude, longitude);
      //           busMarker.setPosition(busLatLng);
      //         }
      //       }
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   };
      // });
    });
  }, function(error) {
    console.log('Could not get location', error);
  });
})

.controller('BusCtrl', function(bus, $scope) {
  $scope.bus = bus;
});

