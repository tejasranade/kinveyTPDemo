// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'kinvey', 'starter.controllers'])

.run(function($ionicPlatform, $kinvey, $rootScope, $state) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Kinvey initialization starts
    var promise = $kinvey.init({
      appKey : 'kid_-J2GLC_a5',
      appSecret : '141c7b602f724af9b3d159eb6f546214',
    });
    promise.then(function() {
      // Kinvey initialization finished with success
      console.log("Kinvey init with success");
      determineBehavior($kinvey, $rootScope, $state);
    }, function(errorCallback) {
      // Kinvey initialization finished with error
      console.log("Kinvey init with error: " + JSON.stringify(errorCallback));
      determineBehavior($kinvey, $rootScope, $state);
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MenuCtrl'
    })

  .state('menu.tabs', {
      url: "/tab",
      views: {
        'menuContent' :{
          templateUrl: "templates/tabs.html"
        }
      }
    })
    .state('menu.tabs.buttons', {
      url: "/buttons",
      views: {
        'buttons-tab': {
          templateUrl: "templates/menu.html"
          //controller: "ButtonsTabCtrl"
        }
      }
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('menu.tabs.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })


  .state('menu.sendemails', {
    url: '/sendemails',
    views: {
      'menuContent': {
        templateUrl: 'templates/sendemails.html',
        controller: 'SendEmailCtrl'
      }
    }
  })

  .state('menu.partners', {
    url: '/partners',
    views: {
      'menuContent': {
        templateUrl: 'templates/partners.html',
        controller: 'PartnerCtrl'
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

.state('menu.recent', {
      url: "/recent",
      views: {
        'menuContent': {
          templateUrl: "templates/recent.html",
          controller: 'RecentCtrl'
        }
      }
    })

  .state('menu.adv1', {
      url: "/adv1",
      views: {
        'menuContent': {
          templateUrl: "templates/adv1.html"
          //controller: 'RecentCtrl'
        }
      }
    })

  .state('menu.adv2', {
      url: "/adv2",
      views: {
        'menuContent': {
          templateUrl: "templates/adv2.html"
          //controller: 'RecentCtrl'
        }
      }
    })

.state('menu.compete', {
      url: "/compete",
      views: {
        'menuContent': {
          templateUrl: "templates/compete.html",
          controller: 'CompeteCtrl'
        }
      }
    })




  .state('menu.risk', {
      url: "/risk",
      views: {
        'menuContent': {
          templateUrl: "templates/risk.html"
          //controller: 'RecentCtrl'
        }
      }
    })

.state('menu.newcust', {
      url: "/newcust",
      views: {
        'menuContent': {
          templateUrl: "templates/newcust.html",
          controller: 'InsertContactCtrl'
        }
      }
    })



  .state('menu.tabs.companies', {
      url: '/companies',
      views: {
        'tab-companies': {
          templateUrl: 'templates/companies.html',
          controller: 'CompanyCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('menu.tabs.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      }
    })


  .state('menu.tabs.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('menu/tab/home');

});

//function selects the desired behavior depending on whether the user is logged or not
function determineBehavior($kinvey, $rootScope, $state) {
  var activeUser = $kinvey.getActiveUser();
  console.log("$state.current.name: " + $state.current.name);
  if (activeUser != null) {
    console.log("activeUser not null determine behavior");
    if ($state.current.name != 'menu.tab.home') {
      $state.go('menu.tabs.home');
    }
  } else {
    console.log("activeUser null redirecting");
    if ($state.current.name != 'menu.tab.account') {
      $state.go('menu.tabs.account');
    }
  }
};
