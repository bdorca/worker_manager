/**
 * Created by dorkab on 2016.07.18..
 */

angular.module('app.controllers')

  .controller('workersCtrl', ['$scope', 'WorkerService', 'workerFactory', '$state', 'localeFactory', '$ionicPopup', '$ionicActionSheet', 'commandFactory', 'MasterService',
    function ($scope, WorkerService, workerFactory, $state, localeFactory, $ionicPopup, $ionicActionSheet, commandFactory, MasterService) {
      $scope.platform = ionic.Platform.platform();
      $scope.masters = workerFactory.getMergedMasters();

      $scope.selected = function (id) {
        console.log(id)
      };

      $scope.refresh = function () {
        WorkerService.fetch(function () {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        }, function (response) {
          alertCallback()
        });
      };

      $scope.toDetails = function (worker) {
        if (worker.master) {
          $state.go('menu.master_details', {"workerId": worker.id})
        } else {
          $state.go('menu.details', {"workerId": worker.id})
        }
      };

      $scope.getString = localeFactory.getString;

      $scope.toggleWorkerGroup = function (group) {
        group.show = !group.show;
      };
      $scope.isWorkerGroupShown = function (group) {
        return group.show;
      };
      $scope.toggleMasterGroup = function (group) {
        group.show = !group.show;
      };
      $scope.isMasterGroupShown = function (group) {
        return group.show;
      };

      $scope.showContextMenu = function (master) {
        var hideSheet = $ionicActionSheet.show({
          titleText: master.name,
          cancelText: localeFactory.getString("cancel"),
          destructiveText: localeFactory.getString("shutdown"),

          destructiveButtonClicked: function () {

            var confirmPopup = $ionicPopup.confirm({
              title: localeFactory.getString("shutdown title").replace("${name}",master.name).replace("$(id)", master.id),
              template: localeFactory.getString("shutdown sure").replace("${name}",master.name).replace("$(id)", master.id),
              okText: "OK",
              cancelText: localeFactory.getString("cancel")
            });

            confirmPopup.then(function (res) {
              if (res) {
                MasterService.shutdown(master, function (response) {
                  console.log(response)
                  if( "err" in response.data){
                    alertCallback(response.data.errMsg)
                  }
                }, function (response) {
                  alertCallback()
                });
              }
            })

          }
        });
      };

      $scope.refresh();

      function alertCallback(message) {
        var alertPopup = $ionicPopup.alert({
          title: localeFactory.getString("connection error title"),
          template: message ? message : localeFactory.getString("connection error")
        });
      }


    }]);

