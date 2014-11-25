'use strict';

var rtdmma = angular.module('rtdmma', [
		"ngRoute",
		"ngResource",
		"ngTouch",
		"rtdmmaFilters",
		"rtdmmaServices",
		"rtdmmaControllers",
		"mobile-angular-ui"
	]);

rtdmma.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/login', {templateUrl: 'login_.html', controller: 'LoginCtrl'}).
		when('/users', {templateUrl: 'user-list_.html', controller: 'UserListCtrl'}).
		when('/users/:userId', {templateUrl: 'user-tasks_.html', controller: 'UserTasksListCtrl'}).
		when ('/task/:taskId', {templateUrl: 'task-detail_.html', controller: 'TaskCtrl'}).
		otherwise({redirectTo: '/login'});
}]);
