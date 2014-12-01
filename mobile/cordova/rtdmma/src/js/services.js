'use strict';

/* Services */
var rtdmmaServices = angular.module('rtdmmaServices', ['ngResource']);

rtdmmaServices.factory('User', function($resource) {
    return $resource('http://tlanrtdm.herokuapp.com/users/list/all', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  })
.factory('UserTasks', function($resource) {
    return $resource('http://tlanrtdm.herokuapp.com/tasksByOwner/:userId', {}, {
      query: {method:'GET', params:{userId: '@userId'}, isArray:false}
    });
  })
.factory('TaskPost',['$http', function($http) {
    return {
        updateTask: function (taskId, data) {
            $http.post('http://tlanrtdm.herokuapp.com/tasks/' + taskId, data).
            success(function(data, status, headers, config) {
                console.info('SaveSuccess @ rtdmmaServices TaskPost updateTask');
                console.debug("data " + angular.toJson(data, true));
                console.debug("status " + angular.toJson(status, true));
                console.debug("headers " + angular.toJson(headers, true));
                console.debug("config " + angular.toJson(config, true));
            }).
            error(function(data, status, headers, config) {
                console.error('SaveError @ rtdmmaServices TaskPost updateTask');
                console.debug("data " + angular.toJson(data, true));
                console.debug("status " + angular.toJson(status, true));
                console.debug("headers " + angular.toJson(headers, true));
                console.debug("config " + angular.toJson(config, true));
            });
        }
    }
}])
.factory('Tasks', ['$resource', function($resource) {
    return $resource ('http://tlanrtdm.herokuapp.com/tasks/:id', {},{
        get:{method: 'GET'}
    });
}]);
   
