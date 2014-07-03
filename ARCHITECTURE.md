# Architecture

The goal of this document is to help contributors quickly understand all the moving parts to fail2web.
If you find yourself confused by something that is undocumented, please feel free to add to this document!

## Libraries
Do your best to avoid duplication of things that are already provided by the following libraries. When
building new DOM elements make sure to use Twitter Bootstrap instead of creating your own. When working
with transforming data try to make your code as terse as possible by using lodash.

* [angular.js](https://angularjs.org/)
* [Twitter Bootstrap](http://getbootstrap.com/)
* [lodash](http://lodash.com/)
* [browserify](http://browserify.org/)

## Source Tree Layout
* css/

    Each css file should only be included by one controller, and the rules in the CSS file
    should only effect elements in that controllers partial
* js/fail2web.js

    This is the entry point of fail2web, this requires all controllers and is the top level
    ng-app in the index.html
* js/controllers

    Contains all the controllers, each controller is actually a directive that includes its
    template via browserify. See the patterns section for more explanation.
* js/services

    Contains all the services, services should be used for all state and anything shared between
    controllers. The goal should be to only have controllers hook service functions to DOM actions.
* partials/

    Partials are the HTML snippets that are include by the directives in js/controllers. Each partials should
    only be included once, and they should only be include by a controller with the same name and styled by a
    style sheet with the same name as well.
* package.json

    This contains the commands to watch/build fail2web, libs fetched from npm and browserify-shim configuration

## Build System
fail2web uses browserify as a build system. This gives us the ability to build small modular components, and use
all the commonjs libs from NPM. The following is not a full guide to browserify, just practical examples that effect
fail2web

### How to run/build
`npm run watch` will start a process that will watch for changes to all file, and will update web/bundle.js as needed you
should use this during development

`npm run build` will run a single pass build that will create your web/bundle.js


## Program Flow
