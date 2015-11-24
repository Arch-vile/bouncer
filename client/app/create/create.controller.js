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
				$scope.bounce.moment = $scope.calculateMoment().format();
				$http.post('/api/bounce/new', $scope.bounce)
					.then(function(response) {
						console.log('It WAS SUCCESS');
						console.log(response);
					}, function(response) {
						console.log('It WAS FAILURE');
						console.log(response);
						$scope.errorFlash = 'Alas! Server is not co-operating with your request: ' + response.data;
					});

			}
		};

		$scope.calculateMoment = function() {
			return moment().add($scope.bounce.amount, $scope.bounce.unit);
		};


	});