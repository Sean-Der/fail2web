'use strict';

require('angular-ui');

var angular = require('angular'),
    fs = require('fs'),
    _ = require('lodash'),
    insertCss = require('insert-css');

insertCss(fs.readFileSync('node_modules/bootstrap/dist/css/bootstrap.min.css'));

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
