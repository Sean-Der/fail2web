'use strict';

module.exports = 'fail2web.sidebar';

var angular = require('angular'),
    insertCss = require('insert-css'),
    fs = require('fs');

insertCss(fs.readFileSync('css/sidebar.css'));

angular.module(module.exports, [require('../services/globalConfig'),
                                require('../services/activeJail'),
                                require('../services/notifications')]).
  directive('sidebar', ['globalConfig', '$http', '$q', 'activeJail', 'notifications', function(globalConfig, $http, $q, activeJail, notifications) {
    return {
      scope: {},
      template: fs.readFileSync('partials/sidebar.html'),
      restrict: 'E',
      controller: function ($scope) {
        $scope.activeJail = activeJail.get();
        $scope.setActiveJail = function(jail) {
          activeJail.set(jail);
        };

        $scope.setCurrentView = function(view) {
          activeJail.setCurrentView(view);
        };

        globalConfig.then(function(config) {
          $http({method: 'GET', url: config.fail2rest + 'global/status'}).
          success(function(jails) {
            $scope.jails = jails;
            activeJail.set(jails[0]);
          }).
          error(notifications.fromHTTPError);
        });
      }
    };
}]);

