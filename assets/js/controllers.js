var NProxyApp = angular.module('nproxy.controllers',[]);

NProxyApp.controller('nproxy.app_list', function ($scope, Apps) {
    Apps.on('news', function (data) {
        $scope.x = data;
        Apps.emit('my other event', { my: 'data' });
    });
});