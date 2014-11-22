var rtdmmaControllers = angular.module('rtdmmaControllers', []);

rtdmmaControllers.
controller('MainCtrl', function ($scope){
    
})
.controller('LoginCtrl', ['$scope', '$rootScope','$location', 'User', function($scope, $rootScope, $location, User) {
    $scope.scan = function() {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                var s = "Result: " + result.text + "<br/>" +
                "Format: " + result.format + "<br/>" +
                "Cancelled: " + result.cancelled;
                console.log(s);
                if (result.cancelled) {
                    alert ('Pressione a imagem para scannear o código do seu crachá!');
                } else {
                    User.query(function(userList) {
                        var userFound = false;
                        console.log("Result: User.query:" + JSON.stringify(userList.result));
                        console.log("Result: Code Read:" + result.text);
                        for(var userIndex in userList.result) {
                            var user = userList.result[userIndex];
                            if (result.text == user._id) {
                                console.log ("Result: UserName: " + user.username);
                                $rootScope.userId = user._id;
                                $rootScope.name = user.name;
                                $rootScope.userName = user.username;
                                userFound = true;
                            }
                        }
                        if (!userFound) {
                            alert ('Usuário inválido!\nInforme outro código!')
                        } else {
                            console.log("Result: userId: " + $rootScope.userId);
                            $location.path("/users/" + $rootScope.userId);
                        }
                    });
                    
                }
            }, 
            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    };
}])
.controller('UserListCtrl', ['$scope', 'User', function ($scope, User){
    'use strict';
    
    User.query(function(data) {
        $scope.users = data;
    });
}])
.controller('UserTasksListCtrl', ['$scope', '$rootScope', 'UserTasks', '$routeParams', function ($scope, $rootScope, UserTasks, $routeParams){
    'use strict';
    $scope.name = $rootScope.name;
    
    UserTasks.query({ userId: $routeParams.userId, startedAt: null}, function (data) {
        $scope.tasks = data;        
    });
}])
.controller('TaskCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Tasks', 'TaskPost', '$interval', function($scope, $rootScope, $routeParams, $location, Tasks, TaskPost, $interval) {
    'use strict';
    $scope.showFinishAndCancelButtons = false;
    $scope.firedFinishButton = false;
    $scope.TaskPost = TaskPost;
    $scope.name = $rootScope.name;
    $scope.postStatus = "Tarefa carregada com sucesso.";
    $scope.postDate = new Date();
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
            $scope.postDate = new Date();
            $scope.postStatus = "Tarefa cancelada.";
        });
        $scope.showFinishAndCancelButtons = false;
        $location.path('#/users/' + $scope.task.owner);        
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
            $scope.postDate = new Date();
            $scope.postStatus = "Finalizando tarefa...";
        });  
        $scope.showFinishAndCancelButtons = false;
        $location.path('#/users/' + $scope.task.owner);
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
            $scope.postDate = new Date();
            $scope.postStatus = "Cliente não encontrado, finalizando tarefa...";
        });  
        $scope.showFinishAndCancelButtons = false;
        $location.path('#/user/' + $scope.task.owner);
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
        console.log ('Task.Id: ' + $scope.taskId + '\n' + 
	    'Geolocation.code: '    + error.code    + '\n' +
	    'Geolocation.message: ' + error.message + '\n');
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
                $scope.postDate = new Date();
                $scope.postStatus = "Posição atualizada com sucesso.";
            } else {
                $scope.TaskPost.updateTask($scope.taskId, {lastCoords:{ lat: position.coords.latitude, lon : position.coords.longitude}});
                $scope.postDate = new Date();
                $scope.postStatus = "Tarefa finalizada com sucesso.";
            }
        }
    };
}]);