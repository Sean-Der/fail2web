'use strict';

module.exports = 'fail2web.navbar';

var angular = require('angular'),
    insertCss = require('insert-css'),
    fs = require('fs');

insertCss(fs.readFileSync('css/navbar.css'));

angular.module(module.exports, [require('../services/settings')]).
  directive('navbar', ['settings', function(settings) {
    return {
      scope: {},
      template: fs.readFileSync('partials/navbar.html'),
      restrict: 'E',
      controller: function ($scope) {
        $scope.settings = settings.get();
        $scope.refreshDetails = settings.getRefreshDetails();

        $scope.setRefresh = function(refresh) {
          settings.set({refresh: refresh});
        };
      }
    };
}]);

