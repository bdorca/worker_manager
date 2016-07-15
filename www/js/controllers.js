mainURL = 'http://localhost:30150/';

angular.module('app.controllers', ["app.services"])

  .controller('loginCtrl', ['$scope', '$ionicPopup', 'workerFactory', 'RequestService', function ($scope, $ionicPopup, workerFactory, RequestService) {

    $scope.login = function () {
      var customer = document.getElementById('input_customer_id').value;
      var username = document.getElementById('input_user_id').value;
      var password = document.getElementById('input_password').value;
      var user = {
        username: username,
        password: password,
        customer: customer
      };
      console.log(user);

      function successCallback(response) {
        console.log("login");
        console.log(response);
        window.location = '#/side-menu/workers';
        credentials = {
          key: response.data.key,
          id: response.data.hawk_id,
          algorithm: response.data.algorithm
        };
        localStorage.setItem('credentials', JSON.stringify(credentials));
        //workerFactory.fetch()
      }

      function errorCallback(response) {
        console.log("fail");
        showAlert(response.data.message);
      }

      RequestService.sendRequest(mainURL + "login", METHODS.GET, false, successCallback
        , errorCallback, user);

    };

    $scope.logout = function () {
      function successCallback(response) {
        console.log("logout");
        console.log(response);
        localStorage.setItem("credentials", "");
        window.location = '#/login';
      }

      function errorCallback(response) {
        console.log("fail");
        console.log(response);
      }

      RequestService.sendRequest(mainURL + "logout", METHODS.GET, true, successCallback, errorCallback, null)
    };

    showAlert = function (message) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed',
        template: message
      });

      alertPopup.then(function (res) {
        console.log('alerted');
      });
    }

  }])

  .controller('workersCtrl', function ($scope, workerFactory) {

    $scope.workers = workerFactory.getWorkers();

    $scope.selected = function (id) {
      console.log(id)
    };

    $scope.refresh = function () {
      workerFactory.fetch();
      workers = workerFactory.getWorkers();
    }
  })

  .controller('detailsCtrl', ['$scope', '$stateParams', '$ionicPopover', 'workerFactory', 'commandFactory', 'WorkerService', function ($scope, $stateParams, $ionicPopover, workerFactory, commandFactory, WorkerService) {
    $scope.selectedWorker = workerFactory.getWorker($stateParams.workerId);
    $scope.commands = commandFactory.getCommands();

    $scope.cmd = function (cmdname) {
      console.log($scope.selectedWorker);
      WorkerService.cmd($scope.selectedWorker, cmdname, function(){$scope.popover.hide()}, function(){$scope.popover.hide()});
    };

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
      popover.show(".ion-more");
    });

  }]);
