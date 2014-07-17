'use strict';

module.exports = 'fail2web.jailDisplay';

var angular = require('angular'),
    insertCss = require('insert-css'),
    _ = require('lodash'),
    fs = require('fs');

insertCss(fs.readFileSync('css/jailDisplay.css'));
require('angular-charts');

angular.module(module.exports, [ require('../services/activeJail'),
                                 require('../services/global'),
                                 'angularCharts']).
  directive('jailDisplay', ['activeJail', 'global', 'globalConfig', '$http', 'notifications', '$modal', function(activeJail, global, globalConfig, $http, notifications, $modal) {
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

        $scope.hasPersistantDB = false;
        $scope.hoveredHost = '';
        $scope.chartConfig = {
            tooltips: true,
            mouseover: function(value) {
                $scope.hoveredHost = value.data.x;
            },
            legend: {
                display: true,
                position: 'right'
            }
        };
        $scope.chartData = {
            series: [],
            data: [],
        };
        $scope.groupedBans = {};

        var rebuildCharts = function() {
          if ($scope.global.bans instanceof Error) {
            $scope.hasPersistantDB = false;
          } else {
            $scope.hasPersistantDB = true;
            var activeJailBans = _.filter($scope.global.bans, function(ban) {
              return ban.Jail === $scope.activeJail.name;
            });
            activeJailBans = _.map(activeJailBans, function(ban) {
              ban.TimeOfBanString = new Date(ban.TimeOfBan * 1000).toString();
              return ban;
            });
            $scope.groupedBans = _.groupBy(activeJailBans, function(ban) {
              return ban.IP;
            });

            $scope.chartData.series = _.keys($scope.groupedBans);
            $scope.chartData.data.length = 0;
            _.forEach($scope.groupedBans, function(value, key) {
              $scope.chartData.data.push({
                x: key,
                y: [value.length],
                tooltip: key
              });
            });
          }
        };

        $scope.$watch('global.bans', rebuildCharts, true);
        $scope.$watch('activeJail.name', rebuildCharts, true);

        $scope.activeJail = activeJail.get();
        $scope.global = global.get();
      }
    };
}]);

