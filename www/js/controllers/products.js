angular.module('starter.controllers').controller('ProductCtrl', function($scope, $kinvey) {

	function refreshData(products){
		$scope.products = products;
		$scope.$digest();
	}

    $scope.$on('$ionicView.beforeEnter', function() {

    	//Read from the products datastore
    	var dataStore = $kinvey.DataStore.collection('Product');
		var stream = dataStore.find();
		stream.subscribe(function onNext(entities) {
		  refreshData(entities);
		}, function onError(error) {
		  // ...
		}, function onComplete() {
		  // ...
		});

    });
})
