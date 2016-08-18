/**
 * Created by dorkab on 7/28/2016.
 */

angular.module('app.services')

  .factory("localeFactory", [function () {

    var LANGUAGES = {
      hun: "magyar",
      eng: "english"
    };

    var language = LANGUAGES.hun;

    var eng = {
      "customer": "Customer ID",
      "username": "Username",
      "password": "Password",
      "workers": "Workers",
      "details": "Details",
      "master": "Master",
      'master details':"Master Details",
      "start": "Start",
      "stop": "Stop",
      "reload": "Reload",
      "status": "Status",
      "registry": "Registry",
      "shutdown": "Shutdown",
      "logout": "Logout",
      "login":"Login",
      "connection error title":"Connection error",
      "connecrion error":"Check your internet connection"
    };

    var hun = {
      "customer": "Ügyfélazonosító",
      "username": "Felhasználónév",
      "password": "Jelszó",
      "workers": "Workerek",
      "details": "Részletek",
      "master": "Master",
      'master details':"Master Részletek",
      "start": "Indítás",
      "stop": "Megállítás",
      "reload": "Újratöltés",
      "status": "Státusz",
      "registry": "Registry",
      "shutdown": "Leállítás",
      "logout": "Kijelentkezés",
      "login":"Bejelentkezés",
      "connection error title":"Kapcsolódási probléma",
      "connection error":"Ellenőrizze a hozzáférést"
    };

    function getString(id) {
      switch (language) {
        case LANGUAGES.eng:
          return eng[id];
        case LANGUAGES.hun:
          return hun[id];
      }
    }


    return {
      getString: getString,
      getLanguages: function () {
        return Object.keys(LANGUAGES).map(function (key) {
          return LANGUAGES[key];
        });
      },
      setLanguage: function (lang) {
        language = lang;
      }
    }

  }]);

