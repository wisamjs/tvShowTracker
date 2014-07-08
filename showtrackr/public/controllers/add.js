angular.module('MyApp')
  .controller('AddCtrl', ['$scope', '$alert', 'Show', function($scope, $alert, Show) {
    $scope.addShow = function() {
      /*
      Show service is injected instead of making post
      request. This way we can use save() method
      provided by $resource.
      */
      Show.save({ showName: $scope.showName },
        //first callback
        function() {
          $scope.showName = '';
          //change state from $dirty to $Pristine
          $scope.addForm.$setPristine();
          $alert({
            content: 'TV show has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        //second callback
        function(response) {
          $scope.showName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: response.data.message,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
  }]);