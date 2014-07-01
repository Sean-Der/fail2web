'use strict';

module.exports = 'fail2web.notificationBar';

var angular = require('angular'),
    insertCss = require('insert-css'),
    fs = require('fs');

insertCss(fs.readFileSync('css/notificationBar.css'));

angular.module(module.exports, [require('../services/notifications')]).
  directive('notificationBar', ['notifications', function(notifications) {
    return {
      scope: {},
      template: fs.readFileSync('partials/notificationBar.html'),
      restrict: 'E',
      controller: function ($scope) {
        $scope.notifications = notifications.get();
        $scope.removeNotification = function(message) {
          notifications.remove(message);
        };
      }
    };
}]);

