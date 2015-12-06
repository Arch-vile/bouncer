'use strict';

angular.module('bouncerApp')
	.controller('DeferCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {

		var deferCommand = {
			token: $state.params.token,
			amount: $state.params.amount,
			units: $state.params.units
		};

		$http.put('/api/bounce/defer', deferCommand).then(function(response) {
			$state.go('view', {
				token: response.data.token
			});
		}).catch(function() {
			$scope.errorFlash = 'Alas! Server is not co-operating with your request: ';
		});

	}]);