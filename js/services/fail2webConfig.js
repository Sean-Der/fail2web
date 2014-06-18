'use strict';

module.exports = 'fail2web.globalConfig';

var angular = require('angular');

angular.module(module.exports, []).
  service('globalConfig', ['$http', '$window', '$q', function($http, $window, $q) {
    var fail2webConfig = $q.defer();

    $http({method: 'GET', url: $window.location.origin + '/config.json'}).
      success(function(data) {
        fail2webConfig.resolve({'fail2rest': $window.location.origin + data.APIRoot});
      });

    return fail2webConfig.promise;
  }]);
