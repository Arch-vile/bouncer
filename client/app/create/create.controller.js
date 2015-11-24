'use strict';

angular.module('bouncerApp')
	.controller('CreateCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
		$scope.bounce = {};
		$scope.bounce.amount = '1';
		$scope.bounce.unit = 'days';

		$scope.submit = function() {
			$scope.newBounceForm.hadErrors = $scope.newBounceForm.$invalid;
			if ($scope.newBounceForm.$valid) {
				$scope.bounce.moment = $scope.calculateMoment().format();
				$http.post('/api/bounce/new', $scope.bounce)
					.then(function(response) {
						$state.go('view', {
							token: response.data.token
						});
					}, function(response) {
						$scope.errorFlash = 'Alas! Server is not co-operating with your request: ' + response.data;
					});

			}
		};

		$scope.calculateMoment = function() {
			return moment().add($scope.bounce.amount, $scope.bounce.unit);
		};


	}]);