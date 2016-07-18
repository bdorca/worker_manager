/**
 * Created by dorkab on 2016.07.18..
 */

angular.module('app.controllers')

  .controller('detailsCtrl', ['$scope', '$stateParams', '$ionicPopover', 'workerFactory', 'commandFactory', 'WorkerService', function ($scope, $stateParams, $ionicPopover, workerFactory, commandFactory, WorkerService) {

    $scope.selectedWorker = workerFactory.getWorker($stateParams.workerId);
    $scope.commands = commandFactory.getWorkerCommands();
    var poppedOver = false;

    function successCallback(response) {
      console.log(response);
      document.getElementById("worker_status").innerHTML = JSON.stringify(response.data);
      $scope.popover.hide();
    }

    function errorCallback(response) {
      console.log(response);
      $scope.popover.hide();
    }

    WorkerService.status($scope.selectedWorker, successCallback, errorCallback);

    $scope.cmd = function (cmdname) {
      console.log($scope.selectedWorker);
      WorkerService.cmd($scope.selectedWorker, cmdname, successCallback, errorCallback)
    };

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
      popover.show();
    });

  }])
  .controller('masterdetailsCtrl', ['$scope', '$stateParams', '$ionicPopover', 'workerFactory', 'commandFactory', 'MasterService', function ($scope, $stateParams, $ionicPopover, workerFactory, commandFactory, MasterService) {

    $scope.selectedWorker = workerFactory.getWorker($stateParams.workerId);
    $scope.commands = commandFactory.getMasterCommands();

    function successCallback(response) {
      console.log(response);
      document.getElementById("master_status").innerHTML = JSON.stringify(response.data);
      $scope.popover.hide();
    }

    function errorCallback(response) {
      console.log(response);
      $scope.popover.hide();
    }

    MasterService.registry($scope.selectedWorker, successCallback, errorCallback);

    $scope.cmd = function (cmdname) {
      console.log($scope.selectedWorker);
      MasterService.cmd($scope.selectedWorker, cmdname, successCallback, errorCallback)
    };

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
      popover.show();
    });

  }])
;
