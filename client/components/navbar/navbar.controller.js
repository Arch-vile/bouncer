'use strict';

angular.module('bouncerApp')
  .controller('NavbarCtrl', function($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'New',
      'link': '/create'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });