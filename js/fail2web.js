'use strict';

require('angular-ui');
require('angular-animate');

var angular = require('angular'),
    fs = require('fs'),
    insertCss = require('insert-css');

insertCss(fs.readFileSync('node_modules/bootstrap/dist/css/bootstrap.min.css'));

insertCss(fs.readFileSync('css/notificationBar.css'));
insertCss(fs.readFileSync('css/base.css'));

angular.module('fail2web', [require('./services/activeJail'),
                            require('./services/notifications'),
                            require('./controllers/navbar'),
                            require('./controllers/sidebar'),
                            'ngAnimate',
                            'ui.bootstrap']).
  controller('jailDisplay', ['$scope', 'activeJail',  function($scope, activeJail) {
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
    $scope.clickOverviewUpdate = function() {
      activeJail.setMaxRetry($scope.activeJail.data.maxRetry);
      activeJail.setFindTime($scope.activeJail.data.findTime);
      activeJail.setUseDNS($scope.activeJail.data.useDNS);
    };
    $scope.activeJail = activeJail.get();
  }]).controller('notificationBar', ['$scope', 'notifications', function($scope, notifications) {
    $scope.notifications = notifications.get();
    $scope.removeNotification = function(message) {
      notifications.remove(message);
    };

  }]);
