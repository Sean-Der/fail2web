'use strict';

module.exports = 'fail2web.jailDisplay';

var angular = require('angular'),
    fs = require('fs');

angular.module(module.exports, [require('../services/activeJail')]).
  directive('jailDisplay', ['activeJail', 'globalConfig', '$http', 'notifications', '$modal', function(activeJail, globalConfig, $http, notifications, $modal) {
    return {
      scope: {},
      template: fs.readFileSync('partials/jailDisplay.html'),
      restrict: 'E',
      controller: function ($scope) {
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
        $scope.clickTestFailRegex = function(regex) {
          activeJail.testFailRegex(regex);
        };
        $scope.clickOverviewUpdate = function() {
          activeJail.setMaxRetry($scope.activeJail.data.maxRetry);
          activeJail.setFindTime($scope.activeJail.data.findTime);
          activeJail.setUseDNS($scope.activeJail.data.useDNS);
        };
        $scope.clickRunWHOIS = function(ipAddress) {
          globalConfig.then(function(config) {
            $http({method: 'GET', url: config.fail2rest + 'whois/' + ipAddress}).
            success(function(whois) {
              $modal.open({
                size: 'lg',
                template: fs.readFileSync('partials/whoisModal.html'),
                controller: function($scope, $modalInstance) {
                  $scope.whois = whois.WHOIS;
                  $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                  };
                }
              });
            }).
            error(notifications.fromHTTPError);
          });
        };
        $scope.activeJail = activeJail.get();
      }
    };
}]);

