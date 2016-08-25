/**
 * Created by dorkab on 2016.07.18..
 */

angular.module('app.controllers')

  .controller('detailsCtrl', ['$scope', '$stateParams', '$ionicPopover', '$ionicPopup', 'workerFactory', 'commandFactory', 'WorkerService', 'localeFactory', function ($scope, $stateParams, $ionicPopover, $ionicPopup, workerFactory, commandFactory, WorkerService, localeFactory) {
    $scope.platform = ionic.Platform.platform();
    $scope.selectedWorker = workerFactory.getWorker($stateParams.workerId);
    $scope.commands = commandFactory.getWorkerCommands();
    var poppedOver = false;

    function successCallback(response) {
      console.log(response);
      if ("err" in response.data) {
        alertCallback(response.data.errMsg)
      }
      $scope.popover.hide();
    }

    function errorCallback(response) {
      console.log(response);
      $scope.popover.hide();
      alertCallback()
    }

    function alertCallback(message) {
      var alertPopup = $ionicPopup.alert({
        title: localeFactory.getString("connection error title"),
        template: message ? message : localeFactory.getString("connection error")
      });
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

    $scope.refresh = function () {
      WorkerService.status($scope.selectedWorker, successCallback, errorCallback, function () {
        $scope.$broadcast('scroll.refreshComplete');
      })
    };

    $scope.getString = localeFactory.getString;

  }])
  .controller('masterdetailsCtrl', ['$scope', '$stateParams', '$ionicPopover', '$ionicPopup', 'workerFactory', 'commandFactory', 'MasterService', 'localeFactory', function ($scope, $stateParams, $ionicPopover, $ionicPopup, workerFactory, commandFactory, MasterService, localeFactory) {
    $scope.platform = ionic.Platform.platform();
    $scope.selectedWorker = workerFactory.getWorker($stateParams.workerId);
    $scope.commands = commandFactory.getMasterCommands();

    function successCallback(response) {
      console.log(response);
      if ("err" in response.data) {
        alertCallback(response.data.errMsg)
      }
      $scope.popover.hide();
    }

    function errorCallback(response) {
      console.log(response);
      $scope.popover.hide();
      alertCallback(response.message);
    }

    function alertCallback(message) {
      var alertPopup = $ionicPopup.alert({
        title: localeFactory.getString("connection error title"),
        template: message ? message : localeFactory.getString("connection error")
      });
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

    $scope.getString = localeFactory.getString;

  }])
;
