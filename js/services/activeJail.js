'use strict';

module.exports = 'fail2web.activeJail';

var angular = require('angular');

angular.module(module.exports, [require('./fail2webConfig')]).
  service('activeJail', ['$http', 'globalConfig', function($http, globalConfig) {
    var activeJail = {name: null,
                      data: {} };
    return {
      set: function(name) {
        globalConfig.then(function(config) {
          activeJail.name = name;
          $http({method: 'GET', url: config.fail2rest + 'jail/' + name}).
            success(function(data) {
              activeJail.data = data;
          });
        });
      },
      get: function() {
        return activeJail;
      },
      banIPAddress: function(ipAddress) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {IP: ipAddress }, url: config.fail2rest + 'jail/' + activeJail.name + '/bannedips'}).
          success(function() {
            if (activeJail.data.IPList.indexOf(ipAddress) === -1) {
                activeJail.data.IPList.push(ipAddress);
                activeJail.data.currentlyBanned += 1;
                activeJail.data.totalBanned += 1;
            }
          });
        });
      },
      unBanIPAddress: function(ipAddress) {
        globalConfig.then(function(config) {
          $http({method: 'DELETE', data: {IP: ipAddress }, url: config.fail2rest + 'jail/' + activeJail.name + '/bannedips'}).
          success(function() {
            var index = activeJail.data.IPList.indexOf(ipAddress);
            if (index !== -1) {
              activeJail.data.IPList.splice(index, 1);
              activeJail.data.currentlyBanned -= 1;
            }
          });
        });
      },
      deleteFailRegex: function(regex) {
        globalConfig.then(function(config) {
          $http({method: 'DELETE', data: {FailRegex: regex}, url: config.fail2rest + 'jail/' + activeJail.name + '/failregex'}).
          success(function() {
            var index = activeJail.data.failRegexes.indexOf(regex);
            if (index !== -1) {
              activeJail.data.failRegexes.splice(index, 1);
            }
          });
        });
      },
      addFailRegex: function(regex) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {FailRegex: regex}, url: config.fail2rest + 'jail/' + activeJail.name + '/failregex'}).
          success(function() {
            activeJail.data.failRegexes.push(regex);
          });
        });
      },

    };
}]);
