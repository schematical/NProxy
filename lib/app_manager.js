var async = require('async');
var config = require('../config');
var forever = require('forever');
var AppClass = require('../lib/app_class');
var vhost = require('vhost');
var http_proxy = require('http-proxy');
var express = require('express');
var http = require('http');
var _ = require('underscore');
var _private = {
    apps:{}
};
module.exports = app_manager = {
    get:function(app_id){
        if(_private.apps[app_id]){

            return _private.apps[app_id];
        }
        if(config.apps[app_id]){
            return new AppClass(
                app_id,
                config.apps[app_id],
                this
            );
        }
        return null;
    },
    list_running:function(callback){
        forever.list(false, function (err, data) {
            if (err) {
                console.log('Error running `forever.list()`');
                console.dir(err);
            }
            var apps = [];
            for(var i in data){
                var app = app_manager.get(data[i].uid);
                if(app){
                    apps.push(app);
                }
            }
            return callback(err, apps);
        });

    },
    list_all:function(callback){
        var results = {};
        for(var app_id in _private.apps){
            results[app_id] = _private.apps[app_id];

        }
        for(var app_id in config.apps){
            if(!results[app_id]){
                results[app_id] =  _private.apps[app_id] = new AppClass(
                    app_id,
                    config.apps[app_id],
                    this
                );
            }
        }
        /*app_manager.list_running(function(err, running){
            if(err) return callback(err);
            for(var i in running){
                results[running[i].uid].child = running[i];
            }

        });*/
        if(callback){
            callback(null, results);
        }
        return results;
    },
    log:function(app, str){
        this.logger.broadcast(app._id +'.log', {message:str});
    },
    error:function(app, str){
        this.log(app, str);
        this.logger.broadcast(app._id +'.error', {message:str});
    },
    event:function(data){
        this.logger.broadcast_event(data);
    },
    /**
     * Kinda a hack to fit this in with /lib/socket
     * @param logger
     */
    set_logger:function(logger){
        this.logger = logger;
    },
    init_express_app:function(callback){


        express_app = express();

        this.express_app = express_app;
        http.createServer(this.express_app).listen(config.proxy_port, callback);
    },
    start_proxy:function(app, callback){
        async.series([
            _.bind(function(next){
                if(!this.express_app){
                    return this.init_express_app(next)
                }
                next();
            }, this),
            _.bind(function(next){
                this.log(app,'Starting Proxy - From: ' + app.app_data.route.from.alias + ' -  To: ' + app.app_data.route.to.host + ':' + app.app_data.route.to.port);

               /* this.proxy_server = http_proxy.createProxyServer({
                    target: app.app_data.route.to.host + ':' + app.app_data.route.to.port
                });*/
                this.proxy = http_proxy.createProxyServer({});
                this.express_app.use(vhost(app.app_data.route.from.alias, _.bind(function (req, res, next) {
                    this.proxy.web(req, res, { target: {
                        host: app.app_data.route.to.host,
                        port: app.app_data.route.to.port
                    }});
                }, this))); // Serves top level domain via Main server app'
                next();
            }, this),
            callback
        ]);
    }
}