'use strict';

module.exports = 'fail2web.activeJail';

var angular = require('angular');

angular.module(module.exports, [require('./fail2webConfig')]).
  service('activeJail', ['$http', 'globalConfig', 'notifications', function($http, globalConfig, notifications) {
    var activeJail = {name: null,
                      currentView: '',
                      data: {} };
    return {
      set: function(name) {
        globalConfig.then(function(config) {
          activeJail.name = name;
          $http({method: 'GET', url: config.fail2rest + 'jail/' + name}).
            success(function(data) {
              activeJail.data = data;
              this.setCurrentView('Overview');
          }.bind(this));
        }.bind(this));
      },
      setCurrentView: function(view) {
        if (['Overview', 'failedIPs', 'failRegexes'].indexOf(view) === -1) {
          throw view + ' is not a valid currentView';
        }
        activeJail.currentView = view;
      },
      get: function() {
        return activeJail;
      },
      banIPAddress: function(ipAddress) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {IP: ipAddress }, url: config.fail2rest + 'jail/' + activeJail.name + '/bannedip'}).
          success(function() {
            if (activeJail.data.IPList.indexOf(ipAddress) === -1) {
                activeJail.data.IPList.push(ipAddress);
                activeJail.data.currentlyBanned += 1;
                activeJail.data.totalBanned += 1;
            }
          }).error(function() {
             notifications.add({message: 'Unable to ban IP', type: 'error'});
          });
        });
      },
      unBanIPAddress: function(ipAddress) {
        globalConfig.then(function(config) {
          $http({method: 'DELETE', data: {IP: ipAddress }, url: config.fail2rest + 'jail/' + activeJail.name + '/bannedip'}).
          success(function() {
            var index = activeJail.data.IPList.indexOf(ipAddress);
            if (index !== -1) {
              activeJail.data.IPList.splice(index, 1);
              activeJail.data.currentlyBanned -= 1;
            }
          }).error(function() {
            notifications.add({message: 'Unable to unban IP', type: 'error'});
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
          }).error(function() {
            notifications.add({message: 'Unable to delete regex', type: 'error'});
          });
        });
      },
      addFailRegex: function(regex) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {FailRegex: regex}, url: config.fail2rest + 'jail/' + activeJail.name + '/failregex'}).
          success(function() {
            activeJail.data.failRegexes.push(regex);
          }).error(function(data) {
            notifications.add({message: data.Error, type: 'error'});
          });
        });
      },
      setMaxRetry: function(maxRetry) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {maxRetry: maxRetry}, url: config.fail2rest + 'jail/' + activeJail.name + '/maxretry'}).
          error(function(data) {
            notifications.add({message: data.Error, type: 'error'});
          });
        });
      },
      setFindTime: function(findTime) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {findTime: findTime}, url: config.fail2rest + 'jail/' + activeJail.name + '/findtime'}).
          error(function(data) {
            notifications.add({message: data.Error, type: 'error'});
          });
        });
      },
      setUseDNS: function(useDNS) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {useDNS: useDNS}, url: config.fail2rest + 'jail/' + activeJail.name + '/usedns'}).
          error(function(data) {
            notifications.add({message: data.Error, type: 'error'});
          });
        });
      }
    };
}]);
