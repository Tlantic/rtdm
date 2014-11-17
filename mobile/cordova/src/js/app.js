'use strict';

/* App Module */

var rtdmma = angular.module('rtdmma', ['ngRoute','ngResource','rtdmmaFilters', 'rtdmmaServices','rtdmmaAnimations','rtdmmaControllers']);

rtdmma.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/users', {templateUrl: 'partials/user-list.html',   controller: 'UserListCtrl'}).
      when('/users/:userId', {templateUrl: 'partials/user-tasks.html', controller: 'UserTasksListCtrl'}).
      when ('/task/:taskId', {templateUrl: 'partials/task-detail.html', controller: 'TaskCtrl'}).
      otherwise({redirectTo: '/users'});
    
}]);
