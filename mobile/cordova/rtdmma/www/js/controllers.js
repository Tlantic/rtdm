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
.controller('TaskCtrl', function($scope, $routeParams, $location, Tasks, TaskPost, cordovaGeolocationService) {
    'use strict';
    $scope.showFinishAndCancelButtons = false;
    $scope.firedFinishButton = false;
    $scope.TaskPost = TaskPost;
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
            $scope.interval = setInterval($scope.updateTask(null, null), 10000);
        });
        $scope.showFinishAndCancelButtons = true;
        localStorage.removeItem('taskId');
        localStorage.setItem("taskId", JSON.stringify($routeParams.taskId));
        $scope.startWatchingPosition();
    }
    
    // Event Fired by Cancel Button
    $scope.cancelTask = function() {
        $scope.firedFinishButton = false;
        $scope.Task.$get({id: $routeParams.taskId}, function(data) {
            $scope.task = data;
            Tasks.$delete({id: task._id});
            clearInterval($scope.interval)
            $scope.stopWatching();
        });
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);        
    }
    
    // Event Fired by Finish Button
    $scope.finishTaskWithSuccess = function () {
        $scope.Task.$get({id: $routeParams.taskId}, function(data) {
            $scope.firedFinishButton = true;
            $scope.task = data;
            $scope.updateTask(1, ''); // Finish Task With Success.
            clearInterval($scope.interval);
            $scope.stopWatchingPosition();
        });  
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);
    }
    
    // Event Fired by Finish With Failure Button
    $scope.finishTaskWithFailure = function (reason) {
        $scope.Task.$get({id: $routeParams.taskId}, function(data) {
            $scope.firedFinishButton = true;
            $scope.task = data;
            $scope.updateTask(0, 'Cliente n&atilde;o encontrado'); 
            clearInterval($scope.interval);
            $scope.stopWatchingPosition();
        });  
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);
    }
    
    // Get Current Position
    $scope.getCurrentPosition = function () {
        cordovaGeolocationService.getCurrentPosition(successHandler);
    };
    
    // start Watching Geolocalization
    $scope.startWatchingPosition = function () {
        $scope.watchId = cordovaGeolocationService.watchPosition(successHandler);
    };
    
    // Stop Watching Geolocalization 
    $scope.stopWatchingPosition = function () {
        cordovaGeolocationService.clearWatch($scope.watchId);
        $scope.watchId = null;
        $scope.currentPosition = null;
    };
    
    // Update Task on API
    $scope.updateTask = function (finished, failureReason) {
        $scope.getCurrentPosition();
        var position = $scope.currentPosition;
        if (finish != null) {
            TaskPost.updatTask($scope.task._id, {lastCoords:{ lat: position.coords.latitude, lon: position.coords.longitude}, finished: finished, failureReason: failureReason}); 
        } else {
            TaskPost.updatTask($scope.task._id, {lastCoords:{ lat: position.coords.latitude, lon: position.coords.longitude}});
        }
    };
    
    // Success Handler
    var successHandler = function (position) {
        $scope.currentPosition = position;
    };
});
