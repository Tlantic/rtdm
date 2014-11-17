'use strict';

/* Controllers */

var rtdmmaControllers = angular.module('rtdmmaControllers',[]);

rtdmmaControllers.controller('UserListCtrl', function ($scope, User){
    User.query(function(data) {
        $scope.users = data;
    });
})
.controller('UserTasksListCtrl', function ($scope, UserTasks, $routeParams){
    UserTasks.query({userId: $routeParams.userId, startedAt: null}, function(data){
        $scope.tasks = data;
        localStorage.removeItem('tasks');
        localStorage.setItem("tasks", JSON.stringify(data));
    });
})
.controller('TaskCtrl', function($scope, $routeParams, $location, UserTasks) {
    getTaskDetail();
        
    $scope.showFinishAndCancelButtons = false;
    
    function getTaskDetail () {
        var tasks = localStorage.getItem('tasks');
        if (tasks != undefined) {
            tasks = JSON.parse(tasks);
            $scope.task = tasks.result.filter(function (data) {
                return data._id == $routeParams.taskId; 
            })[0];
        }
    }
    
    
    $scope.startTask = function () {
        getTaskDetail();
        $scope.task.startedAt = new Date();
        UserTasks.save($scope.task); 
        $scope.showFinishAndCancelButtons = true;
    }
    
    $scope.cancelTask = function() {
        $scope.task.startedAt = null;
        UserTasks.save($scope.task);
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);
    }
    
    $scope.finishTask = function (){
        $scope.task.finishedAt = new Date();
        UserTasks.save($scope.task);
        $scope.showFinishAndCancelButtons = false;
        $location.path('/user/' + $scope.task.owner);
    }
    
});