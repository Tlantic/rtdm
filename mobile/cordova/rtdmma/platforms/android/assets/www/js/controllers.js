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
.controller('TaskCtrl', function($scope, $routeParams, $location, Tasks) {
    'use strict';
    $scope.showFinishAndCancelButtons = false;
    getDetail();
    
    function getDetail() {
        Tasks.get ({id : $routeParams.taskId}, function(data) {
            $scope.task = data;
        });  
    }
    
    $scope.startTask = function () {
        Tasks.get ({id : $routeParams.taskId}, function(data) {
            $scope.task = data;
            $scope.task.startedAt = new Date();
            Tasks.save($scope.task); 
        });  
        $scope.showFinishAndCancelButtons = true;
        localStorage.removeItem('taskId');
        localStorage.setItem("taskId", JSON.stringify($routeParams.taskId));
        /*
        var watchId = navigator.geolocation.watchPosition (onGeolocationSuccess,onGeoLocationError], { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
        localStorage.removeItem('watchId');
        localStorage.setItem("watchId", JSON.stringify(watchId));
        */
    }
    
    $scope.cancelTask = function() {
        Tasks.get ({id : $routeParams.taskId}, function(data) {
            $scope.task = data;
            $scope.task.startedAt = null;
            Tasks.save($scope.task);
        });  
        $scope.showFinishAndCancelButtons = false;
        var watchId = localStorage.getItem ('watchId');
        if (watchId != undefined) {
            watchId = JSON.parse (watchId);
        }
        //navigator.geolocation.clearWatch(watchId);        
        $location.path('/user/' + $scope.task.owner);        
    }
    
    $scope.finishTask = function () {
        $scope.task.finishedAt = new Date();
        Tasks.get ({id : $routeParams.taskId}, function(data) {
            $scope.task = data;
            $scope.task.finishedAt = new Date();
            Tasks.save($scope.task); 
        });  
        $scope.showFinishAndCancelButtons = false;
        var watchId = localStorage.getItem ('watchId');
        if (watchId != undefined) {
            watchId = JSON.parse (watchId);
        }
        //navigator.geolocation.clearWatch(watchId);        
        $location.path('/user/' + $scope.task.owner);
    }  
    
    function onGeolocationSuccess(position) {
        console.log(position);
        $scope.task.startedAt = new Date();
        Tasks.save($scope.task); 
        $scope.showFinishAndCancelButtons = true;
        var taskId = localStorage.getItem ('taskId');
        if (taskId != undefined) {
            taskId = JSON.parse (taskId);
        }
        
        Tasks.query ({id : taskId}, function(data) {
            $scope.task = data;
        });
        
        task.lastCoords = {
            "lat" : position.coords.latitude,
            "lon" : position.coords.longitude
        };
        
        Task.save($scope.task);
        console.log(task);
    }

    function onGeoLocationError(error) {
        console.lo(error);
    }
});