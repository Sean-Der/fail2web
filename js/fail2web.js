'use strict';

var angular = require('angular'),
    fail2webConfig = require('./services/fail2webConfig'),
    _ = require('lodash');

angular.module('fail2web', [fail2webConfig]).
  controller('fail2webLanding', ['$scope', 'globalConfig', '$http', '$q', function($scope, globalConfig, $http, $q) {
    globalConfig.then(function(config) {
      $http({method: 'GET', url: config.fail2rest + 'global/status'}).
        success(function(jails) {
          $q.all(_.map(jails, function(jail) {
            var defer = $q.defer();
            $http({method: 'GET', url: config.fail2rest + 'jail/' + jail}).success(defer.resolve);
            return defer.promise;
          })).then(function(jailStats) {
            $scope.jailStats = jailStats;
          });
        });
    });
  }]);
