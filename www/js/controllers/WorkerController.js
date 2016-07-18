/**
 * Created by dorkab on 2016.07.18..
 */

angular.module('app.controllers')

  .controller('workersCtrl', ['$scope','workerFactory','$state',  function ($scope, workerFactory, $state) {

    $scope.workers = workerFactory.getWorkers();

    $scope.selected = function (id) {
      console.log(id)
    };

    $scope.refresh = function () {
      workerFactory.fetch().finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.toDetails=function(worker){
      if(worker.master){
        $state.go('menu.master_details',{"workerId": worker.id})
      }else{
        $state.go('menu.details',{"workerId": worker.id})
      }
    }

  }]);

