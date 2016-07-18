/**
 * Created by dorkab on 2016.07.18..
 */
angular.module('app.services')

  .factory('commandFactory', ['RequestService', function (RequestService) {
    workerCommands = [
      {name: 'start', icon: 'ion-play'},
      {name: 'stop', icon: 'ion-stop'},
      {name: 'reload', icon: 'ion-refresh'},
      {name: 'status', icon: 'ion-search'}
    ];

    masterCommands=[
      {name: 'registry', icon: 'ion-play'},
      {name: 'shutdown', icon: 'ion-stop'}
    ];

    return {
      getWorkerCommands: function () {
        return workerCommands
      },
      getMasterCommands: function () {
        return masterCommands
      }
    }
  }]);
