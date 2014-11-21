'use strict';

/* App Module */

var rtdmma = angular.module('rtdmma', ['ngRoute','ngResource','ngTouch','rtdmmaFilters', 'rtdmmaServices','rtdmmaControllers']);

rtdmma.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/users', {templateUrl: 'user-list.html',   controller: 'UserListCtrl'}).
      when('/users/:userId', {templateUrl: 'user-tasks.html', controller: 'UserTasksListCtrl'}).
      when ('/task/:taskId', {templateUrl: 'task-detail.html', controller: 'TaskCtrl'}).
      otherwise({redirectTo: '/users'});
    

}]);
