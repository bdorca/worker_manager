Hawk = require("hawk");

METHODS = {
  GET: "GET",
  POST: "POST"
};

angular.module('app.services', [])

  .factory('workerFactory', ['RequestService', function (RequestService) {
    var workerList = [];

    function fetch() {

      function successCallback(response) {
        console.log("hawked");
        console.log(response.data);
        var ids=Object.keys(response.data);
        for(var i=0;i<ids.length;i++) {
          var id=ids[i];
          var name=response.data[id];
          workerList[i]={
            name : name,
            id: id,
            master: id.indexOf("/")<0
          }
        }
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
        for(var i=0;i<workerList.length;i++){
          if(workerList[i].id===workerId){
            return workerList[i];
          }
        }
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

    function cmd(worker, workercmd, successCallback, errorCallback) {
      params = {
        workercmd: workercmd,
        workeraddr: worker.id,
        getParams: function(){
          return "workercmd="+this.workercmd+"&workeraddr="+this.workeraddr;
        }
      };
      RequestService.sendRequest(mainURL + "controller/workercmd", METHODS.POST, true, successCallback, errorCallback, params.getParams());
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
          credentials: credentials
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

      if(params) {
        url += "?" + params;
      }
      var requestOptions = {
        url: url,
        method: method,
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


