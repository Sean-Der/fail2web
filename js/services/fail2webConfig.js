'use strict';

module.exports = 'fail2web.globalConfig';

var angular = require('angular');

angular.module(module.exports, []).
  service('globalConfig', ['$http', '$window', '$q', 'notifications', function($http, $window, $q, notifications) {
    var fail2webConfig = $q.defer();

    $http({method: 'GET', url: $window.location.origin + '/config.json'}).
      success(function(data) {
        fail2webConfig.resolve({'fail2rest': $window.location.origin + data.APIRoot});
      }).
      error(function() {
       notifications.add({message: 'Could not find config.json', type: 'error'});
      });

    return fail2webConfig.promise;
  }]);
