/**
 * Created by dorkab on 2016.07.18..
 */
angular.module('app.services')

  .factory('workerFactory', ['RequestService', function (RequestService) {
    var workerList = [];

    function fetch() {

      function successCallback(response) {
        console.log("hawked");
        console.log(response.data);
        var ids = Object.keys(response.data);
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          var name = response.data[id];
          workerList[i] = {
            name: name,
            id: id,
            master: id.indexOf("/") < 0
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
        for (var i = 0; i < workerList.length; i++) {
          if (workerList[i].id === workerId) {
            return workerList[i];
          }
        }
      },
      fetch: fetch
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
        getParams: function () {
          return "workercmd=" + this.workercmd + "&workeraddr=" + this.workeraddr;
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
  }]);
