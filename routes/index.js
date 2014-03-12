var async = require('async');
var vhost = require('vhost');
var config = require('./../config');
var app_manager = require('../lib/app_manager');
module.exports = function(app){
    app.param('app', function(req, res, next, id){
        req.app = app_manager.get(id);
        return next();
    })
    app.all('/apps', require('./app_list')(app));
    app.all('/apps/:app/deploy', require('./app_deploy')(app));
}