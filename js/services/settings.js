'use strict';

module.exports = 'fail2web.settings';

var angular = require('angular'),
    _       = require('lodash');

angular.module(module.exports, [require('./activeJail'),
                                require('./notifications')]).
  service('settings', ['$interval', 'activeJail', 'notifications', '$window', function($interval, activeJail, notifications, $window) {
    var settings = {refresh: null,
                    desktopNotifications: false},
        refreshDetails = {promise: null, timer: 0},
        refreshDetailsCallback = function() {
          if (refreshDetails.timer === 1) {
            refreshDetails.timer = settings.refresh;
            activeJail.refresh(true);
          } else {
            refreshDetails.timer -= 1;
          }
        };

    return {
      get: function() {
        return settings;
      },
      getRefreshDetails: function() {
        return refreshDetails;
      },
      set: function(newSettings) {
        if (!_.isObject(newSettings)) {
          throw 'settings.set requires an object of the settings you wish to set and their values';
        }
        _.forEach(_.keys(newSettings), function(setting) {
          if (_.isUndefined(settings[setting])) {
            throw setting + ' is not a valid setting';
          }
        });

        if (!_.isUndefined(newSettings.refresh)) {
          settings.refresh = refreshDetails.timer = newSettings.refresh;

          if (refreshDetails.promise) {
            $interval.cancel(refreshDetails.promise);
          }
          if (settings.refresh !== null) {
            refreshDetails.promise = $interval(refreshDetailsCallback, 1000);
          }
        }

        if (!_.isUndefined(newSettings.desktopNotifications)) {
          if (newSettings.desktopNotifications) {
            if (_.isUndefined($window.Notification)) {
                notifications.add({message: 'Desktop Notifications are not supported by your browser', type: 'error' });
            }  else if ($window.Notification.permission === 'granted') {
              settings.desktopNotifications = true;
            } else if ($window.Notification.permission !== 'denied') {
              $window.Notification.requestPermission(function (permission) {
                $window.Notification.permission = permission;
                if (permission === 'granted') {
                  settings.desktopNotifications = true;
                }
              });
            }
          } else {
            settings.desktopNotifications = false;
          }
        }
      }

    };
}]);
