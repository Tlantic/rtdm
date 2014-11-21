var rtdmmaControllers = angular.module('rtdmmaControllers', []);

rtdmmaControllers.
controller('MainCtrl', function ($scope){
    
})
.controller('UserListCtrl', function ($scope, User){
    'use strict';
    
    User.query(function(data) {
        $scope.users = data;
    });
})
.controller('UserTasksListCtrl', function ($scope, UserTasks, $routeParams){
    'use strict';
    
    UserTasks.query({ userId: $routeParams.userId, startedAt: null}, function (data) {
        $scope.tasks = data;        
    });
})
.controller('TaskCtrl', function($scope, $rootScope, $routeParams, $location, Tasks, TaskPost) {
    'use strict';
    $scope.showFinishAndCancelButtons = false;
    $scope.firedFinishButton = false;
    $rootScope.TaskPost = TaskPost;
    getDetail();
    
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
            $scope.firedFinishButton = false;
            $scope.interval = setInterval($rootScope.getCurrentPosition();
            , 5000);
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
            clearInterval($scope.interval)
        });
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);        
    }
    
    // Event Fired by Finish Button
    $scope.finishTaskWithSuccess = function () {
        Tasks.get({id: $routeParams.taskId}, function(data) {
            $scope.firedFinishButton = true;
            $scope.task = data;
            $rootScope.finished = 1;
            $rootScope.failureReason = '';
            $rootScope.getCurrentPosition();
        });  
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);
    }
    
    
    // Event Fired by Finish With Failure Button
    $scope.finishTaskWithFailure = function (reason) {
        Tasks.get({id: $routeParams.taskId}, function(data) {
            $scope.firedFinishButton = true;
            $scope.task = data;
            $rootScope.finished = 0;
            $rootScope.failureReason = 'Cliente n&atilde;o encontrado.';
            $rootScope.getCurrentPosition();
            clearInterval($scope.interval);
        });  
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);
    }
    
    // Get Current Position
    $rootScope.getCurrentPosition = function () {
        navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, {timeout: 5000, enableHighAccuracy: true});
    };
    
    var onGeolocationSuccess = function(position) {
    $rootScope.currentPosition = position;
    console.log(
           'Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Atitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
	};
    
    $rootScope.updateTask();

	// onError Callback receives a PositionError object
	//
	function onGeolocationError(error) {
	    alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}

    
    // Update Task on API
    $rootScope.updateTask = function () {
    	var finished = $rootScope.finished;
    	var failureReason = $rootScope.failureReason;
        console.log ('updateTask: ' + $rootScope.currentPosition);
        if ($rootScope.currentPosition != undefined) {
        	var position = $rootScope.currentPosition;
            if (finished != null) {
                $rootScope.TaskPost.updatTask($scope.task._id, {lastCoords:{ lat: position.coords.latitude, lon: position.coords.longitude}, finished: finished, failureReason: failureReason}); 
            } else {
                $rootScope.TaskPost.updatTask($scope.task._id, {lastCoords:{ lat: position.coords.latitude, lon: position.coords.longitude}});
            }
        }
    };
});