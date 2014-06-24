'use strict';


angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
 .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
 	/* each string in config array
 	is the name of the service to inject
 	for the corresponding parameter */


  	//enable HTML5 pushstate
  	/*locationProvider is a built in
  	AngularJs service for configuring application
  	linking paths.
  	*/
  	$locationProvider.html5Mode(true);

  	//Routesn
  	$routeProvider
	  	.when('/', {
		    templateUrl: 'views/home.html',
		    controller: 'MainCtrl'
		  })
		.when('/shows/:id', {
		    templateUrl: 'views/detail.html',
		    controller: 'DetailCtrl'
		  })
		.when('/login', {
		    templateUrl: 'views/login.html',
		    controller: 'LoginCtrl'
		  })
		.when('/signup', {
		    templateUrl: 'views/signup.html',
		    controller: 'SignupCtrl'
		  })
		.when('/add', {
		    templateUrl: 'views/add.html',
		    controller: 'AddCtrl'
		  })
		.otherwise({
		    redirectTo: '/'
		  });
  }]);