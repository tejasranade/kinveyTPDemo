// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


angular.module('starter', ['ionic', 'kinvey', 'starter.controllers', 'ngIOS9UIWebViewPatch', 'ngCordova'])

.run(function($ionicPlatform, $kinvey, $rootScope, $state, $ionicModal, $location) {

    $rootScope.primarycolor = "#D44B2B";
    
    $rootScope.getActiveUser = function (){
        if (undefined != $kinvey.User){
            return $kinvey.User.getActiveUser();
        }
        return null;
    }

    //$rootScope.productsname = "Products";
    determineBehavior($kinvey, $rootScope, $state, $ionicModal);    

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $kinveyProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    //Initialize Kinvey

    $stateProvider
        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'MenuCtrl'
        })


        .state('menu.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })  


        .state('menu.tasks', {
            url: '/tasks',
            views: {
                'menuContent': {
                    templateUrl: 'templates/tasks.html',
                    controller: 'TasksCtrl'
                }
            }
        })

        .state('menu.doctor', {
            url: '/doctor',
            views: {
                'menuContent': {
                    templateUrl: 'templates/doctors.html',
                    controller: 'DoctorsCtrl'
                }
            }
        })

        .state('menu.ref', {
            url: '/ref',
            views: {
                'menuContent': {
                    templateUrl: 'templates/ref.html',
                    controller: 'RefCtrl'
                }
            }
        })


        .state('menu.brand', {
            url: '/brand',
            views: {
                'menuContent': {
                    templateUrl: 'templates/brand.html',
                    controller: 'BrandCtrl'
                }
            }
        })


        .state('menu.newtask', {
            url: "/newtask",
            views: {
                'menuContent': {
                    templateUrl: "templates/newtask.html",
                    controller: 'InsertTaskCtrl'
                }
            }
        })

        .state('menu.patient', {
            url: "/patient",
            views: {
                'menuContent': {
                    templateUrl: "templates/patient.html",
                    controller: 'PatientCtrl'
                }
            }
        })

        .state('menu.product', {
            url: '/product',
            views: {
                'menuContent': {
                    templateUrl: 'templates/products.html',
                    controller: 'ProductCtrl'
                }
            }
        })

        .state('menu.login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })

        .state('menu.map', {
            //authenticate: true,
            url: '/map',
            views: {
                'menuContent': {
                    templateUrl: 'templates/map.html',
                    controller: 'MapCtrl'
                }
            }
        })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('menu/home');

});


//function selects the desired behavior depending on whether the user is logged or not
function determineBehavior($kinvey, $rootScope, $state, $ionicModal) {

    // //var activeUser = new $kinvey.User();
    // //activeUser = activeUser.getActiveUser();
    // console.log( 'INSIDE DETERMINEBEHAVIOR');
    // //console.log( activeUser );
    // console.log("$state.current.name: " + $state.current.name);

    var activeUser = $rootScope.getActiveUser();
    var activeUser = null;
    if (!activeUser) {
        var $scope = $rootScope.$new();

        console.log("activeUser null redirecting");
        if ($state.current.name != 'menu.login') {
            $state.go('menu.login');
        }
      return;
    } else {
        //we have an active user
        console.log("activeUser not null");
        $state.go('menu.home', null, {reload:true});
    
  }
}