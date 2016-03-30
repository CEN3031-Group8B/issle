'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects', ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'linkify', 'ngDragDrop']);
ApplicationConfiguration.registerModule('standards' , ['projects']);
