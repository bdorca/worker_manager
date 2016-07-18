/**
 * Created by dorkab on 2016.07.18..
 */

Hawk = require("hawk");


angular.module('app.services')

  .service('CredentialService', [function () {
    return {
      hawkHeader: function (url, method) {
        var credentials = JSON.parse(localStorage.getItem("credentials"));
        var header = Hawk.client.header(url, method, {
          credentials: credentials
        });
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
      console.log(requestOptions);
      $http(requestOptions).then(succesCallback, errorCallback);
    }

    return {
      sendRequest: sendRequest
    }
  }]);



