'use strict';

require('angular-ui');
require('angular-animate');

var angular = require('angular'),
    fs = require('fs'),
    insertCss = require('insert-css');

insertCss(fs.readFileSync('node_modules/bootstrap/dist/css/bootstrap.min.css'));
insertCss(fs.readFileSync('css/base.css'));

angular.module('fail2web', [require('./controllers/navbar'),
                            require('./controllers/sidebar'),
                            require('./controllers/notificationBar'),
                            require('./controllers/jailDisplay'),
                            'ngAnimate',
                            'ui.bootstrap']);
