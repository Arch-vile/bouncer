'use strict';

angular.module('bouncerApp')
	.controller('MainCtrl', function($scope) {

		$scope.guideStep = 0;
		$scope.nextStep = function() {
			$scope.guideStep = ($scope.guideStep + 1) % 4;
		};


		$scope.$on('$destroy', function() {

		});
	});