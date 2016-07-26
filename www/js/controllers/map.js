angular.module('starter.controllers').controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $kinvey, $ionicPopover) {
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

      store.live().subscribe(function onSuccess(){


      }, function onError(error){

      });


      
      //var store = $kinvey.DataStore.collection('Bus');

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
