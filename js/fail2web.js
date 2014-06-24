'use strict';

require('angular-ui');
require('angular-animate');

var angular = require('angular'),
    fs = require('fs'),
    insertCss = require('insert-css');

insertCss(fs.readFileSync('node_modules/bootstrap/dist/css/bootstrap.min.css'));
insertCss(fs.readFileSync('css/sidebar.css'));
insertCss(fs.readFileSync('css/notificationBar.css'));

angular.module('fail2web', [require('./services/fail2webConfig'),
                            require('./services/activeJail'),
                            require('./services/notifications'),
                            'ngAnimate',
                            'ui.bootstrap']).
  controller('sidebar', ['$scope', 'globalConfig', '$http', '$q', 'activeJail', 'notifications', function($scope, globalConfig, $http, $q, activeJail, notifications) {
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
        error(function() {
          notifications.add({message: 'Could not contact fail2rest', type: 'error'});
        });
    });
  }]).controller('jailDisplay', ['$scope', 'activeJail',  function($scope, activeJail) {
    $scope.clickBanIPAddress = function(ipAddress) {
        activeJail.banIPAddress(ipAddress);
    };
    $scope.clickUnBanIPAddress = function(ipAddress) {
        activeJail.unBanIPAddress(ipAddress);
    };
    $scope.clickDeleteFailRegex = function(regex) {
      activeJail.deleteFailRegex(regex);
    };
    $scope.clickAddFailRegex = function(regex) {
      activeJail.addFailRegex(regex);
    };
    $scope.activeJail = activeJail.get();
  }]).controller('notificationBar', ['$scope', 'notifications', function($scope, notifications) {
    $scope.notifications = notifications.get();
    $scope.removeNotification = function(message) {
      notifications.remove(message);
    };

  }]);
