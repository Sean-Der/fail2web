'use strict';

require('angular-ui');

var angular = require('angular'),
    _ = require('lodash');

angular.module('fail2web', [require('./services/fail2webConfig'), 'ui.bootstrap']).
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
