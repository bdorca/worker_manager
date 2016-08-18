/**
 * Created by dorkab on 2016.07.18..
 */
function Master(id) {
  this.id = id;
  this.name = id;
  this.status = "master";
  this.master = true;
  this.data = {};
  this.workers = [];
  this.running = function () {
    var count = 0;
    for (var i = 0; i < this.workers.length; i++) {
      if (this.workers[i].status == "working") {
        count++
      }
    }
    return count
  };
  this.workerNum = function () {
    return this.workers.length;
  };

  this.show = false;
}

function Worker(id, name) {
  this.id = id;
  this.name = name;
  this.status = "working";
  this.master = false;
  this.data = {};
  this.workerId=id.substring(id.indexOf("/")+1);
  this.masterId=id.substring(0,id.indexOf("/"));
}

angular.module('app.services')

  .factory('workerFactory', [function () {
    var masterList = [];

    function setWorkerData(id, masterId, data) {
      for (var i = 0; i < masterList.length; i++) {
        if (masterList[i].id == masterId) {
          for (var j = 0; j < masterList[i].workers.length; j++) {
            if (masterList[i].workers[j].workerId == id) {
              masterList[i].workers[j].status = data.currStatus.status;
              masterList[i].workers[j].data = data;
              masterList[i].workers[j].data.currStatus = JSON.stringify(data.currStatus);
              return;
            }
          }
        }
      }

    }

    function addWorker(worker) {
      for (var i = 0; i < masterList.length; i++) {
        if (worker.masterId==masterList[i].id) {
          if(masterList[i].workers.length==0){
            masterList[i].name =worker.name
          }
          masterList[i].workers.push(worker);
        }
      }
    }

    function addMaster(master) {
      masterList.push(master)
    }

    return {
      getMasters: function () {
        return masterList;
      },
      getWorker: function (workerId) {
        for (var i = 0; i < masterList.length; i++) {
          if (workerId.startsWith(masterList[i].id)) {
            for (var j = 0; j < masterList[i].workers.length; j++) {
              if (masterList[i].workers[j].id == workerId) {
                return masterList[i].workers[j];
              }
            }
          }
        }
      },
      setWorkerData: setWorkerData,
      addWorker: addWorker,
      addMaster: addMaster,
      clean: function () {
        masterList.splice(0)
      }
    }


  }])

  .service('WorkerService', ['RequestService', 'workerFactory', 'MasterService', function (RequestService, workerFactory, MasterService) {

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
          if (!("err" in response.data)) {
            var id = response.data.result.id;
            var masterId = response.data.result.masterId;
            var data = response.data.result;
            workerFactory.setWorkerData(id, masterId, data);

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
        id = i % 9 ? "/host - worker " + i : "host - worker " + i;
        workerFactory.addWorker({
          name: name,
          id: id,
          master: id.indexOf("/") < 0,
          status: (i % 9) ? ((i % 4) ? "working" : "stopped") : "master",
          data: {}

        });
      }
    }

    this.fetch = function (finallyCallback, errorCallback) {
      function successCallback(response) {
        console.log(response.data);
        var ids = Object.keys(response.data);
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          var name = response.data[id];
          if (id.indexOf("/") < 0) {
            workerFactory.addMaster(new Master(id))
          } else {
            workerFactory.addWorker(new Worker(id, name));
          }
        }
        setStatuses();
      }

      workerFactory.clean();
      RequestService.sendRequest(mainURL + "controller/addressbook", METHODS.GET, true, successCallback, errorCallback, null, finallyCallback);
      //mockFetch()
    };

    function setStatuses() {
      var masterList = workerFactory.getMasters();
      for (var i = 0; i < masterList.length; i++) {
        MasterService.registry(masterList[i], function (response) {
          },
          function (response) {
            console.log(response)
          });
        for (var j = 0; j < masterList[i].workers.length; j++) {
          cmd(masterList[i].workers[j], COMMAND_TYPE.status,
            function (response) {
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
          if (!("err" in response.data)) {
            worker.data = response.data.localReg.master;
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
