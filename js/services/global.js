'use strict';

module.exports = 'fail2web.global';

var angular = require('angular');

angular.module(module.exports, [require('./globalConfig')]).
  service('global', ['$http', 'globalConfig', 'notifications', function($http, globalConfig, notifications) {
    var global = {
      bans: []
    };
    return {
      refreshBans: function() {
        globalConfig.then(function(config) {
          $http({method: 'GET',  url: config.fail2rest + 'global/bans'}).
          success(function(data) {
            global.bans.length = 0;
            global.push.appyly(global.push, data);
          }).
          error(notifications.fromHTTPError);
        });
      }
    };
}]);
