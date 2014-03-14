var NProxyApp = angular.module('nproxy.controllers',['ansiToHtml', 'ngSanitize']);


NProxyApp.controller('nproxy.app_list', function ($scope, Apps, ansi2html) {
    $scope.logs = {};
    $scope.start = function(app){
        Apps.emit('start', {
            app:app
        });
    }
    $scope.follow = function(app){
        $scope.listening = $scope.apps[app._id];
        document.location = '#' + $scope.listening._id;
        if(!$scope.logs[app._id]){
            $scope.logs[app._id] = [];
            Apps.on(app._id + '.log', function(data){
                data.message_html = ansi2html.toHtml(data.message);
                $scope.logs[app._id].push(data);

                $scope.$apply();
            });
        }
        $scope.listening.log = $scope.logs[app._id];

    }
    Apps.on('update', function (data) {
        $scope.apps = data.apps;
        console.log(data);
        if(document.location.hash && $scope.apps[document.location.hash.substr(1)]){
            $scope.follow(data.apps[document.location.hash.substr(1)]);
        }
        $scope.$apply();

    });
    Apps.on('event', function (data) {
        console.log(data);
        /*{
            type:'deploy',
                status:'success',
            message:'Deploy was successful',
            app:app
        }*/
//        $scope.apps = data.apps;
        $scope.$apply();

    });

});
NProxyApp.controller('nproxy.deploy_form', function ($scope, Apps) {
    $scope.deploy = function(app){
        Apps.deploy(app._id);
    }
});
NProxyApp.controller('nproxy.stop_form', function ($scope, Apps) {
    $scope.root_pass = 'xxx';
    $scope.stop = function(app){
        Apps.emit('stop', {
            app:app,
            root_pass: $scope.root_pass
        });
    }
});
