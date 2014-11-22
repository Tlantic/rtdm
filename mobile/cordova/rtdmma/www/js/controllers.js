var rtdmmaControllers = angular.module('rtdmmaControllers', []);

rtdmmaControllers.
controller('MainCtrl', function ($scope){
    
})
.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.scan = function() {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                var s = "Result: " + result.text + "<br/>" +
                "Format: " + result.format + "<br/>" +
                "Cancelled: " + result.cancelled;
                console.log(s);
            }, 
            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    };
    
    $scope.gotToUsers = function () {
        $location.path('/users');
    };
}])
.controller('UserListCtrl', ['$scope', 'User', function ($scope, User){
    'use strict';
    
    User.query(function(data) {
        $scope.users = data;
    });
}])
.controller('UserTasksListCtrl', ['$scope', 'UserTasks', '$routeParams', function ($scope, UserTasks, $routeParams){
    'use strict';
    
    UserTasks.query({ userId: $routeParams.userId, startedAt: null}, function (data) {
        $scope.tasks = data;        
    });
}])
.controller('TaskCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Tasks', 'TaskPost', '$interval', function($scope, $rootScope, $routeParams, $location, Tasks, TaskPost, $interval) {
    'use strict';
    $scope.showFinishAndCancelButtons = false;
    $scope.firedFinishButton = false;
    $scope.TaskPost = TaskPost;
    getDetail();
    var stopInterval;
    
    // Get Task Detail to Bind Items
    function getDetail() {
        Tasks.get({id: $routeParams.taskId}, function(data) {
            $scope.task = data;
        });  
    }
    
    // Event Fired By Start Button
    $scope.startTask = function () {
        var task = Tasks.get({id: $routeParams.taskId}, function() {
            $scope.task = task;
            $scope.finished = null;
            $scope.failureReason = null;
            $scope.taskId = task._id;
            $scope.firedFinishButton = false;
            $scope.getCurrentPosition();
            if (!angular.isDefined(stopInterval)) {
                stopInterval = $interval(function() {
                    $scope.getCurrentPosition();
                }, 10000);
            }
        });
        $scope.showFinishAndCancelButtons = true;
        localStorage.removeItem('taskId');
        localStorage.setItem("taskId", JSON.stringify($routeParams.taskId));
    }
    
    // Event Fired by Cancel Button
    $scope.cancelTask = function() {
        $scope.firedFinishButton = false;
        var task = Tasks.get({id: $routeParams.taskId}, function(data) {
            $scope.task = data;
            Tasks.$delete({id: task._id});
            $scope.cancelInterval();
        });
        $scope.showFinishAndCancelButtons = false;
        $location.path('/users/' + $scope.task.owner);        
    }
    
    $scope.cancelInterval = function() {
        if (angular.isDefined(stopInterval)) {
            $interval.cancel(stopInterval);
            stopInterval = undefined;
        }
    };
    
    // Event Fired by Finish Button
    $scope.finishTaskWithSuccess = function () {
        Tasks.get({id: $routeParams.taskId}, function(data) {
            $scope.firedFinishButton = true;
            $scope.task = data;
            $scope.finished = 1;
            $scope.failureReason = '';
            $scope.getCurrentPosition();
            $scope.cancelInterval();
        });  
        $scope.showFinishAndCancelButtons = false;
        $location.path('/users/' + $scope.task.owner);
    }
    
    
    // Event Fired by Finish With Failure Button
    $scope.finishTaskWithFailure = function (reason) {
        Tasks.get({id: $routeParams.taskId}, function(data) {
            $scope.firedFinishButton = true;
            $scope.task = data;
            $scope.finished = 0;
            $scope.failureReason = 'Cliente n&atilde;o encontrado.';
            $scope.getCurrentPosition();
            $scope.cancelInterval();
        });  
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);
    }
    
    // Get Current Position
    $scope.getCurrentPosition = function () {
        navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, {timeout: 5000, enableHighAccuracy: true});
    };
    
    var onGeolocationSuccess = function(position) {
    $scope.currentPosition = position;
    console.log(
           'Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Atitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
        
        $scope.updateTask();

	};
    
    
	// onError Callback receives a PositionError object
	//
	function onGeolocationError(error) {
	    alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}

    
    // Update Task on API
    $scope.updateTask = function () {
    	var finished = $scope.finished;
    	var failureReason = $scope.failureReason;
        console.log ('updateTask: ' + $scope.currentPosition);
        if ($scope.currentPosition != undefined) {
        	var position = $scope.currentPosition;
            if (finished != null) {
                $scope.TaskPost.updateTask($scope.taskId, {lastCoords:{ lat: position.coords.latitude, lon: position.coords.longitude}, finished: finished, failureReason: failureReason}); 
            } else {
                $scope.TaskPost.updateTask($scope.taskId, {lastCoords:{ lat: position.coords.latitude, lon: position.coords.longitude}});
            }
        }
    };
}]);