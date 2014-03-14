var async = require('async');
var app_manager = require('../lib/app_manager');
module.exports = function(app){
    return function(req, res, next){


        res.render('app_list.html', {})

    }
}