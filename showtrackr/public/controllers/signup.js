angular.module('MyApp')
  .controller('SignupCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.signup = function() {
      //Using Auth service
      Auth.signup({
        email: $scope.email,
        password: $scope.password
      });
    };
  }]);