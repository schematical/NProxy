angular.module('ionic.ghost.blog', ['ionic', 'ionic.ghost.blog.controllers', 'ionic.ghost.blog.services'])

    //.constant('WUNDERGROUND_API_KEY', '1cc2d3de40fa5af0')

    //.constant('FLICKR_API_KEY', '504fd7414f6275eb5b657ddbfba80a2c')

    .filter('int', function() {
        return function(v) {
            return parseInt(v) || '';
        };

    }).config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: "/home",
                //templateUrl: "home.html",
                controller: 'post-controller'
            })
            .state('posts', {
                url: "/posts/:post/",
                //templateUrl: "home.html",
                controller: 'post-controller'
            })


        // if none of the above are matched, go to this one
        $urlRouterProvider.otherwise("/home");
    })
