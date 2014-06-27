'use strict';

module.exports = 'fail2web.notifications';

var angular = require('angular'),
    _       = require('lodash');

angular.module(module.exports, []).
  service('notifications', [function() {
    var notifications = [],
        notificationsService = {
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
              notifications.splice(index, 1);
            } else {
              notifications[index].amount -= 1;
            }
          },
          get: function() {
            return notifications;
          },
          fromHTTPError: function(body, code) {
            if (code === 404) {
              notificationsService.add({message: '404 Page Not Found - Couldn\'t contact fail2rest', type: 'error'});
            } else if (code === 502) {
              notificationsService.add({message: '502 Bad Gateway - Couldn\'t contact fail2rest', type: 'error'});
            } else if (_.isObject(body) && body.Error) {
              notificationsService.add({message: body.Error, type: 'error'});
            } else {
              notificationsService.add({message: 'Unparseable error when attempting to contact fail2rest', type: 'error'});
            }
          }
        };
      return notificationsService;
}]);
