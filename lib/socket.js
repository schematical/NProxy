var socket_io = require('socket.io');
var app_manager = require('./app_manager');
var _ = require('underscore');


module.exports = nsocket = {
    listen:function(server, express_app){
        this.express_app = express_app;
        this.express_app.io = socket_io.listen(server);


       this.express_app.io.sockets.on('connection', _.bind(this.on_connection, this));
        app_manager.set_logger(this);

    },
    broadcast_event : function(event){
        if(!event.type){
            throw new Error('Event must have a type');
        }
        if(!event.status){
            throw new Error('Event must have a status');
        }
        if(!event.message){
            throw new Error('Event must have a message');
        }
        if(!(event.app || event.app_id)){
            throw new Error('Event must have an app');
        }
        this.express_app.io.sockets.emit('event', event);
        this.broadcast_update();

    },
    broadcast_update:function(){
        app_manager.list_all(_.bind(function (err, apps) {
            var r_apps = {};
            for(var i in apps){
                r_apps[i] = apps[i].toObject();
            }
            this.express_app.io.sockets.emit('update', { apps: r_apps });
        }, this));
    },
    broadcast:function(event, data){
        this.express_app.io.sockets.emit(event, data);
    },
    on_connection:function (socket) {

        socket.on('deploy', _.bind(this.trigger_deploy, this));
        socket.on('stop', _.bind(this.trigger_stop, this));
        socket.on('start', _.bind(this.trigger_start, this));

        this.broadcast_update();
    },
    trigger_deploy:function (data) {
        var app = app_manager.get(data.app_id || data.app._id);
        if(!app){
            //Log failre
            return;
        }
        app.deploy(this.express_app, function(err){
            var status = 'success';
            var message = 'Deploy was successful';
            if(err){
                app_manager.log(err);
                status = 'error';
                message = err.message || 'Deployed failed: Error unknown';
            }
            nsocket.broadcast_event(
                {
                    type:'deploy',
                    status:status,
                    message:message,
                    app_id:app._id
                }
            )
        })
    },
    trigger_stop:function (data) {
        if(data.root_pass != config.root_pass){
            return false;//todo: Trigger some type of error
        }
        var app = app_manager.get(data.app_id || data.app._id);

        app.forever_stop(function(err){
            var status = 'success';
            var message = 'Stop was successful';
            if(err){
                app_manager.log(err);
                status = 'error';
                message = err.message || 'Stop failed: Error unknown';
            }
            nsocket.broadcast_event(
                {
                    type:'stop',
                    status:status,
                    message:message,
                    app_id:app._id
                }
            )
        })
    },
    trigger_start:function (data) {
        var app = app_manager.get(data.app_id || data.app._id);

        app.start( function(err){
            var status = 'success';
            var message = 'Start was successful';
            if(err){
                app_manager.log(err);
                status = 'error';
                message = err.message || 'Stop failed: Error unknown';
            }
            nsocket.broadcast_event(
                {
                    type:'start',
                    status:status,
                    message:message,
                    app_id:app._id
                }
            )
        })
    }

}