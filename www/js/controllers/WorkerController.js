/**
 * Created by dorkab on 2016.07.18..
 */

angular.module('app.controllers')

  .controller('workersCtrl', function ($scope, workerFactory) {

    $scope.workers = workerFactory.getWorkers();

    $scope.selected = function (id) {
      console.log(id)
    };

    $scope.refresh = function () {
      workerFactory.fetch();
      workers = workerFactory.getWorkers();
    }
  });

