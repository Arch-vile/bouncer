'use strict';

angular.module('bouncerApp')
	.controller('CreateCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
		$scope.bounce = {};
		$scope.bounce.amount = '1';
		$scope.bounce.unit = 'days';

		$scope.submit = function() {

			if ($scope.newBounceForm.$valid) {
				$scope.submitting = true;
				$scope.bounce.moment = $scope.calculateMoment().format();
				$http.post('/api/bounce/new', $scope.bounce)
					.then(function(response) {
						$state.go('view', {
							token: response.data.token
						});
					}, function(response) {
						$scope.errorFlash = 'Alas! Server is not co-operating with your request';
						$scope.submitting = false;
					});

			} else {
				$scope.newBounceForm.hadErrors = true;
			}

		};

		$scope.calculateMoment = function() {
			return moment().add($scope.bounce.amount, $scope.bounce.unit);
		};


	}]);