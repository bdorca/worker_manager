/**
 * Created by dorkab on 2016.07.18..
 */

angular.module('app.controllers')

  .controller('workersCtrl', ['$scope','WorkerService', 'workerFactory','$state', 'localeFactory', '$ionicPopup',  function ($scope, WorkerService, workerFactory, $state, localeFactory, $ionicPopup) {

    $scope.masters = workerFactory.getMasters();

    $scope.selected = function (id) {
      console.log(id)
    };

    $scope.refresh = function () {
      WorkerService.fetch(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }, function(response){
        var alertPopup=$ionicPopup.alert({
          title: localeFactory.getString("connection error title"),
          template: localeFactory.getString("connection error")
        });
      });
    };

    $scope.toDetails=function(worker){
      if(worker.master){
        $state.go('menu.master_details',{"workerId": worker.id})
      }else{
        $state.go('menu.details',{"workerId": worker.id})
      }
    };

    $scope.getString=localeFactory.getString;

    $scope.toggleGroup = function(group) {
      group.show = !group.show;
    };
    $scope.isGroupShown = function(group) {
      return group.show;
    };

  }]);

