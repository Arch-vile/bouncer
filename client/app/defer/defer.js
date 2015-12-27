'use strict';

angular.module('bouncerApp')
	.config(function($stateProvider) {

		$stateProvider
			.state('defer', {
				url: '/defer/:token?amount&units',
				controller: 'DeferCtrl'
			});
	});