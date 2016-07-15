Hawk = require("hawk");

METHODS = {
  GET: "GET",
  POST: "POST"
};

angular.module('app.services', [])

  .factory('workerFactory', ['RequestService', function (RequestService) {
    var workerList = [];
    for (var i = 0; i < 3; i++) {
      workerList[i] = {
        name: "worker " + i,
        id: i,
        description: "alma " + i
      }

    }

    function fetch() {

      function successCallback(response) {
        console.log("hawked");
        console.log(response.data);
      }

      function errorCallback(response) {
        console.log("fail");
        console.log(response.data);
      }

      RequestService.sendRequest(mainURL + "controller/addressbook", METHODS.GET, true, successCallback, errorCallback, null);

    }

    return {
      getWorkers: function () {
        return workerList;
      },
      getWorker: function (workerId) {
        return workerList[parseInt(workerId)];
      },
      fetch: fetch
    }
  }])

  .factory('commandFactory', ['RequestService', function (RequestService) {
    commands = [
      {name: 'start', icon: 'ion-play'},
      {name: 'stop', icon: 'ion-stop'},
      {name: 'reload', icon: 'ion-refresh'},
      {name: 'status', icon: 'ion-search'}

    ]

    return {
      getCommands: function () {
        return commands
      }
    }
  }])

  .service('WorkerService', ['RequestService', function (RequestService) {

    var COMMAND_TYPE = {
      start: 'start',
      stop: 'stop',
      reload: 'reload',
      status: 'status'
    };

    function cmd(worker, type, successCallback, errorCallback) {
      params = {
        workercmd: type,
        workeraddr: worker.id
      };
      RequestService.sendRequest(mainURL + "controller/workercmd", METHODS.POST, true, successCallback, errorCallback, params);
    }

    return {
      start: function (worker, successCallback, errorCallback) {
        cmd(worker, COMMAND_TYPE.start, successCallback, errorCallback)
      },
      stop: function (worker, successCallback, errorCallback) {
        cmd(worker, COMMAND_TYPE.stop, successCallback, errorCallback)
      },
      reload: function (worker, successCallback, errorCallback) {
        cmd(worker, COMMAND_TYPE.reload, successCallback, errorCallback)
      },
      status: function (worker, successCallback, errorCallback) {
        cmd(worker, COMMAND_TYPE.status, successCallback, errorCallback)
      },
      cmd: function (worker, type, successCallback, errorCallback) {
        cmd(worker, type, successCallback, errorCallback)
      }
    }
  }])

  .service('CredentialService', [function () {
    return {
      hawkHeader: function (url, method) {
        var credentials = JSON.parse(localStorage.getItem("credentials"));
        var header = Hawk.client.header(url, method, {
          credentials: credentials,
          ext: "some-app-ext-data"
        });
        console.log(header.field);
        return header.field;
      },

      hawkBewit: function (url) {
        var credentials = JSON.parse(localStorage.getItem("credentials"));
        var bewit = Hawk.client.bewit(url, {
          credentials: credentials,
          ttlSec: 300
        });
        return {'bewit': bewit};
      }
    }
  }])

  .service('RequestService', ['$http', 'CredentialService', function ($http, CredentialService) {
    function sendRequest(url, method, needCred, succesCallback, errorCallback, params) {
      var requestOptions = {
        url: url,
        method: method,
        params: params,
        headers: {Accept: "application/json"}
      };
      if (needCred) {
        requestOptions.headers.Authorization = CredentialService.hawkHeader(url, method);
        // requestOptions.params = CredentialService.hawkBewit(url);
      }
      console.log(requestOptions)
      $http(requestOptions).then(succesCallback, errorCallback);
    }

    return {
      sendRequest: sendRequest
    }
  }]);


