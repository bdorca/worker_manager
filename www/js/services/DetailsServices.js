/**
 * Created by dorkab on 2016.07.18..
 */
angular.module('app.services')

  .factory('commandFactory', ['RequestService', function (RequestService) {
    commands = [
      {name: 'start', icon: 'ion-play'},
      {name: 'stop', icon: 'ion-stop'},
      {name: 'reload', icon: 'ion-refresh'},
      {name: 'status', icon: 'ion-search'}

    ];

    return {
      getCommands: function () {
        return commands
      }
    }
  }]);
