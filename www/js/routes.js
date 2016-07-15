angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

      .state('menu', {
        url: '/side-menu',
        templateUrl: 'templates/menu.html',
        abstract: true,
        controller: 'loginCtrl'
      })
      

      .state('menu.workers', {
        url: '/workers',
        views: {
          'side-menu': {
            templateUrl: 'templates/workers.html',
            controller: 'workersCtrl'
          }
        }
      })

      .state('menu.details', {
        url: '/details/{{workerId}}',
        views: {
          'side-menu': {
            templateUrl: 'templates/details.html',
            controller: 'detailsCtrl'
          }
        }
      })
    


    $urlRouterProvider.otherwise('/login')


  });
