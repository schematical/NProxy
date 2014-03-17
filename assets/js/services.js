var nproxy_services = angular.module('nproxy.services', []);

nproxy_services.factory('Apps',  function(){
    var socket = window.io.connect('http://' + document.location.hostname);

    return socket;
});
