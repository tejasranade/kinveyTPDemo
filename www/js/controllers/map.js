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
        content: 'My location'
      });

      // Listen for a click event on the current location marker
      google.maps.event.addListener(currentLocationMarker, 'click', function() {
        infoWindow.open($scope.map, currentLocationMarker);
      });

      var busMarkers = {};


      var busIcon = {
        url: './img/bus_icon.png',
        size: new google.maps.Size(60, 60),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 15),
        scaledSize: new google.maps.Size(30, 30)
      };


      function updateBusMarker(data){
        var op = data.op;
        var bus = data.data;

        if (op ==='update' && bus) {
          var busMarker = busMarkers[bus._id];
          if (!busMarker){
              //create a bus marker
              busMarker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: busLatLng,
                  icon: busIcon
              });
              busMarkers[bus._id] = busMarker;

              var infoWindow = new google.maps.InfoWindow({
                  content: bus.name
              });

              google.maps.event.addListener(busMarker, 'click', function(){
                  infoWindow.open($scope.map, busMarker);
              });
          }

          if (busMarker) {
            var latitude = bus.location[1];
            var longitude = bus.location[0];
            var busLatLng = new google.maps.LatLng(latitude, longitude);
            busMarker.setPosition(busLatLng);
          }
        }      
      }


      //Subscribe to a bus update
      var store = $kinvey.DataStore.collection('Bus');
      store.subscribe({
          onNext: function(data) {
              //Called when new data is available. 
              //This is where you should write code to act on new data
              updateBusMarker(data);
          }, 
          onError: function (error) {
              //Called on errors
               console.log(error);
          }, 
          onComplete: function () {
              //Called when the stream completes
              console.log("complete!");
          }
      });


    });
  }, function(error) {
    console.log('Could not get location', error);
  });
})
