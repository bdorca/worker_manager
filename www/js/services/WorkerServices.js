/**
 * Created by dorkab on 2016.07.18..
 */
angular.module('app.services')

  .factory('workerFactory', [function () {
    var workerList = [];

    function setWorkerData(id, data) {
      for (var i = 0; i < workerList.length; i++) {
        if (workerList[i].id.indexOf(id) > -1) {
          workerList[i].status = data.currStatus.status;
          workerList[i].data = data;
          console.log(workerList[i].status);
          return;
        }
      }

    }

    function addWorker(worker){
      workerList[workerList.length]=worker;
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
      setWorkerData: setWorkerData,
      addWorker: addWorker,
      clean:function (){
        workerList.splice(0)
      }
    }


  }])

  .service('WorkerService', ['RequestService', 'workerFactory', function (RequestService, workerFactory) {

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
      if (workercmd == COMMAND_TYPE.status) {
        function defSuccessCallback(response) {
          console.log(response)
          if(!("err" in response.data)){
            var id = response.data.result.id;
            var data = response.data.result;
            workerFactory.setWorkerData(id, data);

          }
          successCallback(response);
        }

        RequestService.sendRequest(mainURL + "controller/workercmd", METHODS.POST, true, defSuccessCallback, errorCallback, params.getParams());
      } else {
        RequestService.sendRequest(mainURL + "controller/workercmd", METHODS.POST, true, successCallback, errorCallback, params.getParams());
      }
    }

    this.start = function (worker, successCallback, errorCallback) {
      cmd(worker, COMMAND_TYPE.start, successCallback, errorCallback)
    };
    this.stop = function (worker, successCallback, errorCallback) {
      cmd(worker, COMMAND_TYPE.stop, successCallback, errorCallback)
    };
    this.reload = function (worker, successCallback, errorCallback) {
      cmd(worker, COMMAND_TYPE.reload, successCallback, errorCallback)
    };
    this.status = function (worker, successCallback, errorCallback) {
      cmd(worker, COMMAND_TYPE.status, successCallback, errorCallback)
    };
    this.cmd = function (worker, type, successCallback, errorCallback) {
      cmd(worker, type, successCallback, errorCallback)
    };

    function mockFetch() {

      for (var i = 0; i < 10; i++) {
        name = "worker " + i;
        id = i % 9 ?  "/host - worker " + i:"host - worker " + i;
        workerFactory.addWorker({
          name: name,
          id: id,
          master: id.indexOf("/") < 0,
          status: (i % 9) ?  ((i % 4) ? "working":"stopped") :"master",
          data: {}

        });
      }
    }

    this.fetch=function(finallyCallback, errorCallback) {
      function successCallback(response) {
        console.log(response.data);
        var ids = Object.keys(response.data);
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          var name = response.data[id];
          workerFactory.addWorker({
            name: name,
            id: id,
            master: id.indexOf("/") < 0,
            status: "master",
            data: {}
          });
        }
        setStatuses();
      }

      workerFactory.clean();
       RequestService.sendRequest(mainURL + "controller/addressbook", METHODS.GET, true, successCallback, errorCallback, null, finallyCallback);
      //mockFetch()
    };

    function setStatuses() {
      var workerList=workerFactory.getWorkers();
      for (var i = 0; i < workerList.length; i++) {
        if (!workerList[i].master) {
          cmd(workerList[i], COMMAND_TYPE.status,
            function (response) {
              console.log(response)
            },
            function (response) {
              console.log(response)
            })
        }
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
      if (mastercmd == COMMAND_TYPE.registry) {
        function defSuccessCallback(response) {
          if(!("err" in response.data)){
            worker.data=response.data.localReg.master;
          }
          successCallback(response);
        }

        RequestService.sendRequest(mainURL + "controller/mastercmd", METHODS.POST, true, defSuccessCallback, errorCallback, params.getParams());
      } else {
        RequestService.sendRequest(mainURL + "controller/mastercmd", METHODS.POST, true, successCallback, errorCallback, params.getParams());
      }
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
