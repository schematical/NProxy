var nproxy_services = angular.module('nproxy.services', []);

nproxy_services.factory('Apps',  function(){
    var socket = window.io.connect('http://localhost');
    socket.deploy = function(app_id){
        socket.emit('deploy', { app_id:app_id });
    }
    return socket;
});
