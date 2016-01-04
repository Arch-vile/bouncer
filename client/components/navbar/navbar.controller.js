'use strict';

angular.module('bouncerApp')
  .controller('NavbarCtrl', function($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Create',
      'link': '/create'
    }, {
      'title': 'Contact',
      'link': '/contact'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });