'use strict';

angular.module('bouncerApp')
	.config(function($stateProvider) {

		$stateProvider
			.state('create', {
				url: "/create",
				templateUrl: "app/create/create.html",
				controller: "CreateCtrl"
			});
	});