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
                console.log('SaveSuccess');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            }).
            error(function(data, status, headers, config) {
                console.log('SaveError');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        }   
    }
}])
.factory('Tasks', ['$resource', function($resource) {
    return $resource ('http://tlanrtdm.herokuapp.com/tasks/:id', {},{
        get:{method: 'GET'}});
}]);
   
