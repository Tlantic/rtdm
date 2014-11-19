'use strict';

/* Services */
var rtdmmaServices = angular.module('rtdmmaServices', ['ngResource']);

rtdmmaServices.factory('User', function($resource) {
    return $resource('http://http://tlanrtdm.herokuapp.com/users/list/all', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  })

.factory('UserTasks', function($resource) {
    return $resource('http://http://tlanrtdm.herokuapp.com/tasksByOwner/:userId', {}, {
      query: {method:'GET', params:{userId: '@userId'}, isArray:false},
      get: {method:'GET', params:{_id:'@id'}, isArray:false},
      save: {method: 'POST'}
    });
  })
.factory('Tasks', function($resource) {
   return $resource('http://http://tlanrtdm.herokuapp.com/tasks/:id', {}, {
      query: {method:'GET', params:{id: '@id'}, isArray:false},
      get: {method:'GET', params:{id:'@id'}, isArray:false},
      save: {method: 'POST'}
    });
});
