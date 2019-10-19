movieStubApp.controller("movieStubController", function($scope, movieStubFactory, $location) {


    $scope.headerSrc = "tmpl/header.html";

    $scope.movies = movieStubFactory.query();

    $scope.currMovie = null;

    $scope.getMovieById = function(id) {
        var movies = $scope.movies;
        for (var i = 0; i < movies.length; i++) {
            var movie = $scope.movies[i];
            if (movie.id == id) {
                $scope.currMovie = movie;
            }
        }
    };

    $scope.back = function() {
        window.history.back();
    };

    $scope.getCount = function(n) {
        return new Array(n);
    }

    $scope.isActive = function(route) {
        return route === $location.path();
    }

    $scope.isActivePath = function(route) {
        return ($location.path()).indexOf(route) >= 0;
    }

});

movieStubApp.controller("movieDetailsController", function($scope, $routeParams) {
    $scope.getMovieById($routeParams.id);
});
movieStubApp.controller("loginDetailController", function($scope, $timeout, UserDetail) {
    var todo = this;
    //var auth = $firebaseAuth();
    todo.user = {}
    todo.google = google;
    //todo.facebook = facebook;

    function google() {
        console.log("hello");
        /*  var promise = auth.$signInWithPopup("google");
        promise.then(function(result) {

            console.log(result.user.displayName, result.user.photoURL);
            todo.user.name = result.user.displayName;
            todo.user.img = result.user.photoURL;
        }).catch(function(err) {
            console.log(err);
        });

    }*/
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.

            var user = result.user;
            $timeout(function() {
                $scope.displayErrorMsg = false;
                console.log("hiiiiii");
                $scope.UserData = result;
                console.log($scope.UserData);
                UserDetail.addProduct($scope.UserData);
            }, 2000);

            console.log(user.displayName);


            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
});
movieStubApp.controller("bookTicketsController", function($scope, $http, $location, $routeParams, UserDetail) {
    $scope.getMovieById($routeParams.id);
    $scope.onlyNumbers = /^\d+$/;
    $scope.formData = {};
    $scope.formData.movie_id = $scope.currMovie.id;
    $scope.formData.movie_name = $scope.currMovie.name;
    $scope.formData.date = "Today"
        // $scope.UserData = UserData;

    console.log("hii");
    $scope.processForm = function() {
        console.log($scope.formData);
        $http({
                method: 'POST',
                url: '/book',
                data: $.param($scope.formData), // pass in data as strings
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                } // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                $location.path("/seatpicker");
            });
    };

});

movieStubApp.controller("bookingDetailsController", function($scope, movieStubBookingsFactory) {
    $scope.bookings = movieStubBookingsFactory.query();
});

movieStubApp.controller('quantityModuleController', ['$scope', '$window', 'seatsManager', 'UserDetail', '$http', function($scope, $window, seatsManager, UserDetail, $http) {
    var init = function() {
        $scope.premiumSeats = seatsManager.getSeats('Premium');
        $scope.standardSeats = seatsManager.getSeats('Standard');
        $scope.seats = seatsManager;
        $scope.quantities = [{
            id: 0,
            val: 0
        }, {
            id: 1,
            val: 1
        }, {
            id: 2,
            val: 2
        }, {
            id: 3,
            val: 3
        }, {
            id: 4,
            val: 4
        }, ];
        $scope.seatQualities = ['Premium', 'Standard'];
        $scope.seatQuality = 'Standard';
        $scope.selectedCount = $scope.quantities[1];
        seatsManager.setAvailCount($scope.selectedCount);
    }

    $scope.storeSeat = function() {
        if ($scope.seats.availCount.val != 0) {
            $window.alert("You haven't selected " +
                $scope.seats.availCount.val + " seats");
            return;
        }
        var sessionInfo = seatsManager.bookCheckedSeats();
        seatsManager.setAvailCount($scope.selectedCount);

        // console.log(sessionInfo.checkedSeats);

        $scope.alertMsg = [];
        angular.forEach(sessionInfo.checkedSeats, function(v, k) {
            for (var i = 0; i < v.length; i++) {
                $scope.alertMsg.push(v[i].val + v[i].letter);
            }
        });
        $scope.UserData = UserDetail.getProducts();

        // console.log($scope.UserData[0].user.displayName);
        //console.log($scope.UserData[0].user.email);
        $scope.UserInfo = {};
        $scope.UserInfo.name = $scope.UserData[0].user.displayName;
        $scope.UserInfo.emailId = $scope.UserData[0].user.email;
        $scope.UserInfo.totalSeat = sessionInfo.count;
        $scope.UserInfo.seats = $scope.alertMsg.join(', ');

        console.log($scope.UserInfo);
        $http({
                method: 'POST',
                url: '/userInfo',
                data: $.param($scope.UserInfo), // pass in data as strings
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                } // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                // $location.path("/seatpicker");
                // $window.alert('Confirmed');
            });

        $window.alert('Thank you for Booking ' + sessionInfo.count + ' seats. ' +
            'Your seats are: ' + $scope.alertMsg.join(', '));
    };

    init();

}]);