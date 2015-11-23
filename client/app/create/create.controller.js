'use strict';

angular.module('bouncerApp')
	.controller('CreateCtrl', function($scope, $http, socket) {
		$scope.foo = 'bar';
		socket.syncUpdates('zeta', $scope.foo);
		$http.get('/api/things');


		$scope.submit = function() {
			$scope.newBounceForm.hadErrors = $scope.newBounceForm.$invalid;
			if ($scope.newBounceForm.$valid) {

			}
		};

	});