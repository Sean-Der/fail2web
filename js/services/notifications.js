'use strict';

module.exports = 'fail2web.notifications';

var angular = require('angular'),
    _       = require('lodash');

angular.module(module.exports, []).
  service('notifications', [function() {
    var notifications = [];
    return {
      add: function(notification) {
        var index = _.findIndex(notifications, notification);
        if (index === -1) {
          notifications.push(_.merge(notification, {amount: 1}));
        } else {
          notifications[index].amount += 1;
        }
      },
      remove: function(message) {
        var index = _.findIndex(notifications, {message: message});
        if (index === -1) {
          return;
        }
        if (notifications[index].amount === 1) {
          delete notifications[index];
        } else {
          notifications[index].amount -= 1;
        }
      },
      get: function() {
        return notifications;
      }
  };
}]);
