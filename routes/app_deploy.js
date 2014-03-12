var async = require('async');
var config = require('./../config');


module.exports = function(app){
    return function(req, res, next){
        if(!req.app){
            return next(new Error("No app found"));
        }
        req.app.deploy(
            app,
            function(){
                res.end("Done!");
            }
        )
    }
}