'use strict';

module.exports = 'fail2web.activeJail';

var angular = require('angular'),
    _       = require('lodash');

angular.module(module.exports, [require('./globalConfig'),
                                require('./global')]).
  service('activeJail', ['$http', 'globalConfig', 'global', 'notifications', function($http, globalConfig, global, notifications) {
    var activeJail = {name: null,
                      currentView: '',
                      testFailRegex: {},
                      data: {} };
    return {
      set: function(name) {
        activeJail.name = name;
        this.refresh(false);
        this.setCurrentView('Overview');
      },
      setCurrentView: function(view) {
        if (['Overview', 'failedIPs', 'failRegexes'].indexOf(view) === -1) {
          throw view + ' is not a valid currentView';
        }
        if (view === 'failedIPs') {
          global.refreshBans();
        }
        activeJail.currentView = view;
      },
      get: function() {
        return activeJail;
      },
      refresh: function(alerts) {
        globalConfig.then(function(config) {
          $http({method: 'GET', url: config.fail2rest + 'jail/' + activeJail.name}).
            success(function(data) {
              if (alerts && activeJail.data.IPList) {
                _.forEach(_.difference(activeJail.data.IPList, data.IPList), function(ip) {
                  notifications.add({message: ip + ' has been unbanned', type: 'warning'});
                });
                _.forEach(_.difference(data.IPList, activeJail.data.IPList), function(ip) {
                  notifications.add({message: ip + ' has been banned', type: 'warning'});
                });
              }
              activeJail.testFailRegex = {};
              activeJail.data = data;
          }.bind(this)).
            error(notifications.fromHTTPError);
        }.bind(this));
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
          }).
          error(notifications.fromHTTPError);
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
          }).
          error(notifications.fromHTTPError);
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
          }).
          error(notifications.fromHTTPError);
        });
      },
      addFailRegex: function(regex) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {FailRegex: regex}, url: config.fail2rest + 'jail/' + activeJail.name + '/failregex'}).
          success(function() {
            activeJail.data.failRegexes.push(regex);
          }).
          error(notifications.fromHTTPError);
        });
      },
      setMaxRetry: function(maxRetry) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {MaxRetry: maxRetry}, url: config.fail2rest + 'jail/' + activeJail.name + '/maxretry'}).
          error(notifications.fromHTTPError);
        });
      },
      setFindTime: function(findTime) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {FindTime: findTime}, url: config.fail2rest + 'jail/' + activeJail.name + '/findtime'}).
          error(notifications.fromHTTPError);
        });
      },
      setUseDNS: function(useDNS) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {UseDNS: useDNS}, url: config.fail2rest + 'jail/' + activeJail.name + '/usedns'}).
          error(notifications.fromHTTPError);
        });
      },
      testFailRegex: function(failRegex) {
        globalConfig.then(function(config) {
          $http({method: 'POST', data: {FailRegex: failRegex}, url: config.fail2rest + 'jail/' + activeJail.name + '/testfailregex'}).
          success(function(data) {
            activeJail.testFailRegex = data;
          }).
          error(notifications.fromHTTPError);
        });
      }
    };
}]);
