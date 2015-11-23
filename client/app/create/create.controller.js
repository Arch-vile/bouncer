'use strict';

angular.module('bouncerApp')
	.controller('CreateCtrl', function($scope, $http, socket) {
		$scope.foo = 'bar';
		socket.syncUpdates('zeta', $scope.foo);
		$http.get('/api/things');

		$scope.submit = function() {
			console.log("in submit function")
			if ($scope.newBounceForm.$valid) {
				// Submit as normal
				console.log("is valid")
			} else {
				console.log("not valid")
				$scope.newBounceForm.submitted = true;
			}
		};

	});