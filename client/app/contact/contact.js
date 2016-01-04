'use strict';

angular.module('bouncerApp')
	.config(function($stateProvider) {
		$stateProvider
			.state('contact', {
				url: "/contact",
				templateUrl: "app/contact/contact.html"
			});
	});