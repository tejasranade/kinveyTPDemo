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
        //var activeUser = $kinvey.User.getActiveUser();
        var activeUser = $rootScope.getActiveUser();

        if (!activeUser) {
            $state.go('menu.login');
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

