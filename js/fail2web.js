'use strict';

require('angular-ui');

var angular = require('angular'),
    fs = require('fs'),
    _ = require('lodash'),
    insertCss = require('insert-css');

insertCss(fs.readFileSync('node_modules/bootstrap/dist/css/bootstrap.min.css'));
insertCss(fs.readFileSync('css/sidebar.css'));

angular.module('fail2web', [require('./services/fail2webConfig'),
                            require('./services/activeJail'),
                            'ui.bootstrap']).
  controller('sidebar', ['$scope', 'globalConfig', '$http', '$q', 'activeJail', function($scope, globalConfig, $http, $q, activeJail) {
    $scope.setActiveJail = function(jail) {
      activeJail.set(jail);
    };

    globalConfig.then(function(config) {
      $http({method: 'GET', url: config.fail2rest + 'global/status'}).
        success(function(jails) {
          $scope.jails = jails;
          activeJail.set(jails[0]);
        });
    });
  }]).controller('jailDisplay', ['$scope', 'activeJail',  function($scope, activeJail) {
    $scope.activeJail = activeJail.get();
  }]);
