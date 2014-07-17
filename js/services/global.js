'use strict';

module.exports = 'fail2web.global';

var angular = require('angular');

angular.module(module.exports, [require('./globalConfig')]).
  service('global', ['$http', 'globalConfig', function($http, globalConfig) {
    var global = {
      bans: []
    };
    return {
      get: function() {
        return global;
      },
      refreshBans: function() {
        globalConfig.then(function(config) {
          $http({method: 'GET',  url: config.fail2rest + 'global/bans'}).
          success(function(data) {
            global.bans.length = 0;
            global.bans.push.apply(global.bans, data);
          }).
          error(function() {
            global.bans = new Error('persisted bans are not supported by your fail2ban instance');
          });
        });
      }
    };
}]);
