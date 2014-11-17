'use strict';

/* Services */
var rtdmmaServices = angular.module('rtdmmaServices', ['ngResource']);

rtdmmaServices.factory('User', function($resource){
    return $resource('http://localhost:5000/users/list/all', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  })

.factory('UserTasks', function($resource){
    return $resource('http://localhost:5000/tasksByOwner/:userId', {}, {
      query: {method:'GET', params:{userId: '@userId'}, isArray:false},
      get: {method:'GET', params:{_id:'@id'}, isArray:false},
      save: {method: 'POST'}
    });
  });
