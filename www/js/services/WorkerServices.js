/**
 * Created by dorkab on 2016.07.18..
 */
angular.module('app.services')

  .factory('workerFactory', ['RequestService', 'WorkerService', '$q', function (RequestService, WorkerService, $q) {
    var workerList = [];
    var deferred=$q.defer();

    function fetch() {

      function successCallback(response) {
        console.log(response.data);
        var ids = Object.keys(response.data);
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          var name = response.data[id];
          workerList[i] = {
            name: name,
            id: id,
            master: id.indexOf("/") < 0,
            status: "master"
          }
        }
        setStatuses();
        deferred.resolve();
      }

      function errorCallback(response) {
        console.log("fail");
        console.log(response.data);
        deferred.reject();
      }

      RequestService.sendRequest(mainURL + "controller/addressbook", METHODS.GET, true, successCallback, errorCallback, null);

      return deferred.promise;
    }

    function setStatuses() {
      for (var i = 0; i < workerList.length; i++) {
        if (!workerList[i].master) {
          WorkerService.status(workerList[i],
            function (response) {
              var id = response.data.result.id;
              var status = response.data.result.currStatus.status;
              setWorkerStatus(id, status)
            },
            function (response) {
              console.log(resopnse)
            })
        }
      }
    }

    function setWorkerStatus(id, status) {
      for (var i = 0; i < workerList.length; i++) {
        if (workerList[i].id.indexOf(id)>-1) {
          workerList[i].status = status;
          console.log(workerList[i].status)
          return;
        }
      }
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
      fetch: fetch,
      setWorkerStatus: setWorkerStatus
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
  }])

  .service('MasterService', ['RequestService', function (RequestService) {

    var COMMAND_TYPE = {
      registry: 'registry',
      shutdown: 'shutdown'
    };

    function cmd(worker, mastercmd, successCallback, errorCallback) {
      params = {
        mastercmd: mastercmd,
        masteraddr: worker.id,
        getParams: function () {
          return "mastercmd=" + this.mastercmd + "&masteraddr=" + this.masteraddr;
        }
      };
      RequestService.sendRequest(mainURL + "controller/mastercmd", METHODS.POST, true, successCallback, errorCallback, params.getParams());
    }

    return {
      registry: function (worker, successCallback, errorCallback) {
        cmd(worker, COMMAND_TYPE.registry, successCallback, errorCallback)
      },
      shutdown: function (worker, successCallback, errorCallback) {
        cmd(worker, COMMAND_TYPE.shutdown, successCallback, errorCallback)
      },
      cmd: function (worker, type, successCallback, errorCallback) {
        cmd(worker, type, successCallback, errorCallback)
      }
    }
  }]);
