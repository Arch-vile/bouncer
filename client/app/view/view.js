'use strict';

angular.module('bouncerApp')
	.config(function($stateProvider) {
		$stateProvider
			.state('view', {
				url: "/view/:token",
				templateUrl: "app/view/view.html",
				controller: "ViewCtrl"
			});
	});