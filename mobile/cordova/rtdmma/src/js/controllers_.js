var rtdmmaControllers = angular.module('rtdmmaControllers', []);

rtdmmaControllers.
controller('MainCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
	'use strict';

	$rootScope.loggedIn = 0;

	$scope.logout = function() {
		$rootScope.loggedIn = 0;
		console.info("Logout()");
		console.debug("MainCtrl@logout rootScope.loggedIn = " + $rootScope.loggedIn);
		console.debug("MainCtrl@logout rootScope.userId   = " + $rootScope.userId);
		console.debug("MainCtrl@logout rootScope.name     = " + $rootScope.name);
		console.debug("MainCtrl@logout rootScope.userId   = " + $rootScope.userId);

		$scope.toggle('mainSidebar','off');

		console.debug("location.path /login");
		$location.path("/login");
	};
}])
.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {
	'use strict';

	$rootScope.loggedIn = 0;
	$rootScope.appClass = "page-login";
	$rootScope.userId = undefined;
	$rootScope.name = undefined;
	$rootScope.userName = undefined;
	$scope.toggle('mainSidebar','off');

	$scope.fakeScan = function() {
		$rootScope.loggedIn = 1;
		$rootScope.userId = "546241bbc7a4804c068589c7";
		$rootScope.name = "Entregador Exemplo";
		$rootScope.userName = "user.exemplo";
		$location.path("/users/" + $rootScope.userId);
	};

	$scope.scan = function() {
		$scope.scanning = true;
		cordova.plugins.barcodeScanner.scan(
			function (result) {
				var s = "Result: " + result.text + "<br>" +
				"Format: " + result.format + "<br>" +
				"Cancelled: " + result.cancelled;
				console.log(s);
				if (result.cancelled) {
					$scope.scanning = false;
					alert ('Pressione o botão e enquadre o código de ativação!');
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
								$rootScope.loggedIn = 1;
								userFound = true;
							}
						}
						$scope.scanning = false;
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
				$scope.scanning = false;
				alert("Falha na captura: " + error);
			}
		);
	};

	$scope.exit = function() {
		if (window.client.mobile) {
			navigator.app.exitApp();
		};
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
	$rootScope.loggedIn = 1;
	$rootScope.appClass = 'page-user-tasks has-navbar-top';
	$scope.name = $rootScope.name;

	UserTasks.query({ userId: $routeParams.userId, startedAt: null}, function (data) {
		$scope.tasks = data;
	});
}])
.controller('TaskCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Tasks', 'TaskPost', '$interval', function($scope, $rootScope, $routeParams, $location, Tasks, TaskPost, $interval) {
	'use strict';

	$rootScope.appClass = 'page-task has-navbar-top';

	$scope.showFinishAndCancelButtons = false;
	$scope.firedFinishButton = false;
	$scope.TaskPost = TaskPost;
	$scope.name = $rootScope.name;
	$scope.postStatus = "Tarefa carregada com sucesso.";
	$scope.postDate = new Date();

	getDetail();
	var stopInterval,
		posLat = "0",
		posLon = "0",
		watchID = "N";

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
			$scope.watchID = navigator.geolocation.watchPosition(
				onGeolocationSuccess,
				onGeolocationError,
				{ maximumAge: 60000, timeout: 10000, enableHighAccuracy: true }
			);
			// $scope.getCurrentPosition();
			// if (!angular.isDefined(stopInterval)) {
			// 	stopInterval = $interval(function() {
			// 		$scope.getCurrentPosition();
			// 	}, 20000);
			// }
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
			Tasks.delete({id: task._id});
			$scope.cancelInterval();
			$scope.postDate = new Date();
			$scope.postStatus = "Tarefa cancelada.";
			localStorage.removeItem('taskId');
		});
		$scope.showFinishAndCancelButtons = false;
		$location.path('/users/' + $rootScope.userId);
	}

	$scope.cancelInterval = function() {
		console.info("RTDMINFO TaskCtrl cancelInterval()");
		if (angular.isDefined(stopInterval)) {
			$interval.cancel(stopInterval);
			stopInterval = undefined;
		}
		console.debug("RTDMDEBUG geolocation.clearWatch $scope.watchID ", $scope.watchID);
		navigator.geolocation.clearWatch($scope.watchID);
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
		$location.path('/users/' + $rootScope.userId);
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
		$location.path('/users/' + $rootScope.userId);
	}

	// Get Current Position
	$scope.getCurrentPosition = function () {
		navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, {timeout: 15000, enableHighAccuracy: true});
	};

	var onGeolocationSuccess = function(position) {
		console.info("RTDMINFO",
			"TaskCtrl onGeolocationSuccess()"
		);
	$scope.currentPosition = position;
	console.debug("RTDMDEBUG",
		  'Latitude: '          + position.coords.latitude          + '\n' +
		  'Longitude: '         + position.coords.longitude         + '\n' +
		  'Altitude: '          + position.coords.altitude          + '\n' +
		  'Accuracy: '          + position.coords.accuracy          + '\n' +
		  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		  'Heading: '           + position.coords.heading           + '\n' +
		  'Speed: '             + position.coords.speed             + '\n' +
		  'Timestamp: '         + position.timestamp                + '\n');

		$scope.posLat = position.coords.latitude;
		$scope.posLon = position.coords.longitude;
		$scope.updateTask();
	};


	// onError Callback receives a PositionError object
	//
	function onGeolocationError(error) {
		console.error ('Task.Id: ' + $scope.taskId + '\n' +
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
				$scope.postStatus = "Tarefa finalizada com sucesso.";
			} else {
				$scope.TaskPost.updateTask($scope.taskId, {lastCoords:{ lat: position.coords.latitude, lon : position.coords.longitude}});
				$scope.postDate = new Date();
				$scope.postStatus = "Posição atualizada com sucesso.";
			}
		}
	};
}]);