'use strict';

module.exports = 'fail2web.jailDisplay';

var angular = require('angular'),
    fs = require('fs');


angular.module(module.exports, [require('../services/activeJail')]).
  directive('jailDisplay', ['activeJail', function(activeJail) {
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
        $scope.clickOverviewUpdate = function() {
          activeJail.setMaxRetry($scope.activeJail.data.maxRetry);
          activeJail.setFindTime($scope.activeJail.data.findTime);
          activeJail.setUseDNS($scope.activeJail.data.useDNS);
        };
        $scope.activeJail = activeJail.get();
      }
    };
}]);

