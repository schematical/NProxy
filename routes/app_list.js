var async = require('async');
var app_manager = require('../lib/app_manager');
module.exports = function(app){
    return function(req, res, next){
        app_manager.list_all(function (err, apps) {
            if(err) return next(err);
            var local = { apps:[] }
            for(var i in apps){
                local.apps.push(apps[i]);
            }
            res.render('app_list', local)
        });
    }
}