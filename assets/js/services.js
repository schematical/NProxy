var nproxy_services = angular.module('nproxy.services', []);

nproxy_services.factory('Apps',  function(){
    var socket = io.connect('http://localhost');
    return socket;
});
