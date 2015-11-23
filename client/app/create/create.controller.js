'use strict';

angular.module('bouncerApp')
	.controller('CreateCtrl', function($scope, $http, socket) {
		$scope.foo = 'bar';
		socket.syncUpdates('zeta', $scope.foo);
		$http.get('/api/things');

		$scope.bounce = {};
		$scope.bounce.amount = '1';
		$scope.bounce.unit = 'days';

		$scope.submit = function() {
			$scope.newBounceForm.hadErrors = $scope.newBounceForm.$invalid;
			if ($scope.newBounceForm.$valid) {

			}
		};

		$scope.calculateMoment = function() {
			return moment().add($scope.bounce.amount, $scope.bounce.unit).calendar();
		};

	});