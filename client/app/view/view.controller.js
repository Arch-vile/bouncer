'use strict';

angular.module('bouncerApp')
	.controller('ViewCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

		$http.get('/api/bounce/' + $stateParams.token)
			.then(function(response) {
				console.log("VIEW response");
				console.log(response);
				$scope.topic = response.data.topic;
				var utc = moment(response.data.moment);;
				$scope.moment = utc.calendar();
			}, function(response) {
				console.log("VIEW error");
				$scope.errorFlash = 'Alas! Server is not co-operating with your request: ' + response.data;
			});


	}]);