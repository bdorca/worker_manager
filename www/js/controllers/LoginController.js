/**
 * Created by dorkab on 2016.07.18..
 */

angular.module('app.controllers')

  .controller('loginCtrl', ['$scope', '$ionicPopup', '$state', 'RequestService', 'localeFactory', function ($scope, $ionicPopup, $state, RequestService, localeFactory) {

    $scope.login = function () {
      var customer = document.getElementById('input_customer_id').value;
      var username = document.getElementById('input_user_id').value;
      var password = document.getElementById('input_password').value;
      var user = {
        username: username,
        password: password,
        customer: customer,
        getParams: function () {
          return "username=" + username + "&password=" + password + "&customer=" + customer;
        }
      };
      console.log(user);

      function successCallback(response) {
        console.log("login");
        console.log(response);
        $state.go('menu.workers');
        credentials = {
          key: response.data.key,
          id: response.data.hawk_id,
          algorithm: response.data.algorithm
        };
        localStorage.setItem('credentials', JSON.stringify(credentials));
      }

      function errorCallback(response) {
        console.log("fail");
        showAlert(response.data.message);
      }

      RequestService.sendRequest(mainURL + "login", METHODS.GET, false, successCallback, errorCallback, user.getParams());

    };

    $scope.logout = function () {
      function successCallback(response) {
        console.log("logout");
        console.log(response);
        localStorage.setItem("credentials", "");
        $state.go('login');
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
    };

    $scope.getString = localeFactory.getString;
    $scope.languages = localeFactory.getLanguages();
    $scope.language=$scope.languages[0];
    $scope.setLanguage =function(l) {
      localeFactory.setLanguage(l);
    }
    
    
  }]);

