angular.module('starter.controllers', ['kinvey'])

.controller('DashCtrl', function($scope) {

    $scope.myTest = function() {
        console.log('inside myTest');
        $ionicSideMenuDelegate.toggleLeft();
    };


})

.controller('ChatsCtrl', function($scope, $kinvey) {
    $kinvey.DataStore.find('chats').then(function(chats) {
        $scope.chats = chats;
    });
    $scope.remove = function(chatId) {
        $kinvey.DataStore.destroy('chats', chatId).then(function() {
            console.log("chat deleted: " + chatId);
        });
    }
})


.controller('SearchCtrl', function($scope, $kinvey) {

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('load search view');
        var user = Kinvey.getActiveUser();
        var query = new Kinvey.Query();
        query.equalTo('userOwner', user.email);
        console.log(user.email);
        $kinvey.DataStore.find('companies', query).then(function(companies) {
            console.log(companies);
            $scope.companies = companies;
        });
    });


    $scope.searchme = function() {
        console.log('inside searchctrl');

        console.log(document.getElementById("chosenCompany").value);

        var query = new Kinvey.Query();
        query.equalTo('companyname', document.getElementById("chosenCompany").value);
        $kinvey.DataStore.find('companies', query).then(function(accountlist) {
            console.log(accountlist);
            $scope.accountlist = accountlist;
        });
    };
})

.controller('InsertContactCtrl', function($scope, $kinvey, $ionicLoading) {
    $scope.insertme = function() {
        var mycname = document.getElementById("custname").value;
        document.getElementById("custname").value = "";
        console.log(mycname);

        var mycompanyname = document.getElementById("companyname").value;
        console.log(mycompanyname);
        document.getElementById("companyname").value = "";

        var mycell = document.getElementById("cell").value;
        document.getElementById("cell").value = "";
        var myemail = document.getElementById("email").value;
        document.getElementById("email").value = "";
        var myaddr1 = document.getElementById("addr1").value;
        document.getElementById("addr1").value = "";
        var myzip = document.getElementById("zip").value;
        document.getElementById("zip").value = "";

        var data = {};

        data.contactname = mycname;
        data.companyname = mycompanyname;
        data.cell = mycell;
        data.email = myemail;
        data.addr1 = myaddr1;

        data.zip = myzip;
        console.log(mycname + ' ' + mycompanyname);

        $kinvey.DataStore.save('contacts', data).then(function(data) {
            console.log(data);
        });

        $ionicLoading.show({
            template: 'contact inserted',
            noBackdrop: true,
            duration: 2000
        });

    };
})



.controller('CompeteCtrl', function($scope, $kinvey, $ionicLoading) {
    $scope.compareme = function() {
        console.log('inside compareme');
        var mychkAuto = document.getElementById("chkAuto").checked;
        console.log(mychkAuto);

        var mychkHome = document.getElementById("chkHome").checked;
        console.log(mychkHome);


        var mychkLife = document.getElementById("chkLife").checked;
        console.log(mychkLife);

        var data = {};

        data.auto = mychkAuto;
        data.home = mychkHome;
        data.life = mychkLife;
        data.name = "Mattie";


        $kinvey.DataStore.save('competition', data).then(function(data) {

            console.log(data);
            $scope.acme = data.acme;
            $scope.amfam = data.amfam;
            $scope.progressive = data.progressive;
            $scope.statefarm = data.statefarm;
        });

        $ionicLoading.show({
            template: 'computing price comparison',
            noBackdrop: true,
            duration: 2000
        });

    };
})


.controller('SendEmailCtrl', function($scope, $kinvey, $ionicLoading) {
    $scope.sendme = function() {
        var myemail = document.getElementById("sendtoemail").value;
        document.getElementById("sendtoemail").value = "";
        var sendtoname = document.getElementById("myrecipientname").value;
        document.getElementById("myrecipientname").value = "";
        console.log(myemail);

        var data = {};

        data.to = myemail;
        data.subject = "Time to Schedule an Insurance Coverage Review";
        data.body = "Dear Policyholder:\n\n\nWe notice that you are past due for a coverage review.  Did you know that over half of all coverage reviews end up saving the customer money?  Contact your agent today for a comprehensive look at your coverage.>";
        data.html_body = "<html>Dear " + sendtoname + ":<br><br>We notice that you are past due for a coverage review.  Did you know that over half of all coverage reviews end up saving the customer money?  Contact your agent today for a comprehensive look at your coverage.<br><img src='http://www.lexpage.com/images/inscard2.jpg'></html>";
        data.reply_to = "coveragereviw@acmeinsurance.com";

        console.log(myemail);
        //Kinvey.DataStore.save('books', data);
        $kinvey.DataStore.save('email', data).then(function(data) {
            console.log(data);
        });

        $ionicLoading.show({
            template: 'email sent',
            noBackdrop: true,
            duration: 2000
        });
    };
})



.controller('CompanyCtrl', function($scope, $kinvey) {

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('load view');

        console.log('inside companyctrl');
        var user = Kinvey.getActiveUser();
        var query = new Kinvey.Query();
        query.equalTo('userOwner', user.email);
        console.log(user.email);
        $kinvey.DataStore.find('companies', query).then(function(companies) {
            console.log(companies);
            $scope.companies = companies;
        });
    });
})



.controller('PartnerCtrl', function($scope, $kinvey) {

   $scope.doRefresh = function() {
     console.log('refresh');
     $kinvey.DataStore.find('partner').then(function(partners) {
            console.log(partners);
            $scope.partners = partners;
        });
      }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('partner load view');
        $kinvey.DataStore.find('partner').then(function(partners) {
            console.log(partners);
            $scope.partners = partners;
        });
    });
    
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




.controller('RiskCtrl', function($scope) {

    $scope.showRisk = true;

    $scope.computeRisk = function() {
        console.log('yo, risk here');

        var myage = document.getElementById("yourage").value;
        var mygender = document.getElementById("yourgender").value;
        var myweight = document.getElementById("yourweight").value;
        var myexercise = document.getElementById("yourexercise").value;
        var mysmoker = document.getElementById("yoursmoker").checked;
        console.log("They smoke: " + mysmoker);

        var healthdata = {};
        healthdata.name = 'MattieD';
        healthdata.myage = myage;
        healthdata.myweight = myweight;
        healthdata.mysmoker = mysmoker;
        healthdata.mygender = mygender;
        healthdata.myexercise = myexercise;



        var promise = Kinvey.execute('healthcalc', healthdata, {
            success: function(response) {
                console.log('riskFactor = ' + response.riskfactor);
                console.log('advice = ' + response.advice);
                document.getElementById("myrisk").value = response.riskfactor;
                $scope.riskrating = response.riskfactor;
                $scope.myadvice = response.advice;
            }
        });
        $scope.showRisk = false;
        console.log('risk = ' + $scope.showRisk);

    }

    console.log('risk');
})


.controller('WeatherCtrl', function($scope, $ionicSlideBoxDelegate) {

    $scope.myActiveSlide = 0;

    $scope.directorClick = function() {
        $scope.myActiveSlide = 1;
        $ionicSlideBoxDelegate.slide(1);
        console.log('director');
        console.log($scope.myActiveSlide)
    };

    $scope.accidentClick = function() {
        $scope.myActiveSlide = 2;
        $ionicSlideBoxDelegate.slide(2);
        console.log('accident');
    };

    $scope.homeClick = function() {
        $scope.myActiveSlide = 0;
        $ionicSlideBoxDelegate.slide(0);
        console.log('home');
    };

    $scope.keyClick = function() {
        $scope.myActiveSlide = 3;
        $ionicSlideBoxDelegate.slide(3);
        console.log('key');
    };

    console.log('tornado');
})

.controller('HomeCtrl', function($scope, $kinvey) {
    console.log('home');

    $scope.$on('$ionicView.enter', function() {
        console.log('before entering home');

        //var query = new Kinvey.Query();
        //query.equalTo('_id', '5539149bbbc83fd84a015bb5');

        $kinvey.DataStore.find('brand').then(function(brand) {
            console.log(brand[0].headerlabel);
            $scope.headerlabel = brand[0].headerlabel;
        });
    });

})



.controller('AccountCtrl', function($scope, $state, $kinvey) {
    $scope.userData = {
        email: "",
        password: ""
    };


    $scope.validateUser = function() {
        var promise = $kinvey.User.login({
            username: $scope.userData.email,
            password: $scope.userData.password
        });
        promise.then(
            function(response) {
                //Kinvey login finished with success
                $scope.submittedError = false;
                $state.go('menu.tabs.home');
            },
            function(error) {
                //Kinvey login finished with error
                $scope.submittedError = true;
                $scope.errorDescription = error.description;
                console.log("Error login " + error.description); //
            }
        );
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
        //Kinvey logout starts
        var promise = $kinvey.User.logout();
        promise.then(
            function() {
                //Kinvey logout finished with success
                console.log("user logout");
                $kinvey.setActiveUser(null);
            },
            function(error) {
                //Kinvey logout finished with error
                alert("Error logout: " + JSON.stringify(error));
            }
        );
    }

});