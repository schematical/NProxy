var async = require('async');
var config = require('../config');
var forever = require('forever');
var AppClass = require('../lib/app_class');
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
    list:function(callback){
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

    }
}