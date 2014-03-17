var async = require('async');
var forever = require('forever');
var _ = require('underscore');
var GitHubApi = require('github');
var fs = require('fs');
var request = require('request');
var unzip = require('unzip');
var mkdirp = require('mkdirp');
var npm = require("npm");
var config = require('../config');

module.exports = _app = function(app_id, app_data, app_manager){
    this._id = app_id;
    this.app_data = app_data;
    this.app_manager = app_manager;
    return this;
}
_app.prototype.deploy = function(callback){
    async.series([
        _.bind(this.pull_code_full, this),
        _.bind(this.npm_install, this),
        _.bind(this.forever_start, this),
        _.bind(function(next){   this.app_manager.start_proxy(this, next);  }, this),
        callback
    ]);
}
_app.prototype.start = function(app, callback){
    async.series([
        _.bind(this.forever_start, this),
        _.bind(function(next){   this.app_manager.start_proxy(this, next);  }, this),
        callback
    ]);
}
_app.prototype.npm_install = function(callback){

    npm.load({}, _.bind(function (err) {
        if (err) {
            this.app_manager.error(this, err);
            return callback(err)
        }
        npm.commands.install([], _.bind(function (err, data) {
            if (err) {
                this.app_manager.error(this, err);
                return callback(err)
            }
            // command succeeded, and data might have some info
            this.app_manager.log(this, "NPM SUCCESS: ");
            this.app_manager.log(this, JSON.stringify(data));
            callback();
        }, this));
        npm.on("log", _.bind(function (message) {
            this.app_manager.log(this, 'NPM: ' + message);
        }, this));
    }, this))
}

_app.prototype.forever_start = function(callback){
    if(this.child){
        return this.child.restart();

    }
    var script = this.app_data.script;
    if(!fs.existsSync(script)){
        script = this.wd() + '/' + script;
    }
    if(!fs.existsSync(script)){
        return callback(new Error("Failed to start app. Script does not exist -> " + script));
        this.app_manager.log(app, "Failed to start app");
    }
    this.child = child = new (forever.Monitor) (script, {
        options: [/*'--port', this.app_data.route.to.port*/],
        silent: true,
        env: { 'PORT': this.app_data.route.to.port },
        uid:(this.app_data.process && this.app_data.process.id) || this._id,
        cwd: this.wd(),
        logFile: '../_test/' + this._id + '.log'
    });


    this.child.on('start', _.bind(function (err, data) {
     /*   if(err) {
            this.app_manager.error(this, err);
            return callback(err);
        }*/
        this.child.child.stderr.on('data', _.bind(this._stderr, this));
        this.child.child.stdout.on('data', _.bind(this._stdout, this));
        this.app_manager.log(this, "Server Started");

        forever.startServer(child, callback);
    }, this));

    this.child.on('exit', _.bind(this._process_exit, this));
    this.child.start();

}
_app.prototype.github = function(){
    var github = new GitHubApi({
         // required
         version: "3.0.0",
         // optional
         debug: true,
         pathPrefix: "/api/v3", // for some GHEs*//*
         timeout: 5000
     });
    github.authenticate(
        this.app_data.github.user || config.default_git_user
    )

}
_app.prototype.pull_code_full = function(callback){

    var quick_name = this.app_data.github.repo + '-' + this.branch();
    var tmp = quick_name + '.zip';
    var app_dir = config.app_dir || (__dirname + '/../apps');
    if(this.app_data.github && this.app_data.github.deploy_to_dir){
        deploy_to_dir = this.app_data.github.deploy_to_dir;
    }else{
        var deploy_to_dir = app_dir +'/'+ quick_name;//TODO: Make this a unique dir
    }
    if(!fs.existsSync(deploy_to_dir)){
        mkdirp.sync(deploy_to_dir);
    }
    async.series([
        _.bind(function(next){

            var url = 'https://github.com/' + this.app_data.github.user + '/' + this.app_data.github.repo + '/archive/';
            url += this.branch();
            url += '.zip';
            this.app_manager.log(this, 'Pulling Code From Github: '+ url);
            var stream = fs.createWriteStream(tmp);
            request(url, {
                'auth': {
                    'user': config.default_git_user.username,
                    'pass': config.default_git_user.password
                }
            }).pipe(stream);
            stream.on('finish', next);
        }, this),
        _.bind(function(next){
            this.app_manager.log('Code pulled to  '+ tmp);
            fs.createReadStream(tmp)
                .pipe(unzip.Parse())
                .on('finish', next)
                .on('entry', _.bind(function (entry) {

                    var entity_path = entry.path;
                    var type = entry.type; // 'Directory' or 'File'
                    var size = entry.size;
                    if(entity_path.substr(0, quick_name.length) == quick_name){
                        var to_entity_path =  deploy_to_dir + entity_path.substr(quick_name.length);
                        this.app_manager.log(this, 'Extracting: ' + to_entity_path);
                        if(type == 'File'){
                            entry.pipe(fs.createWriteStream(
                                to_entity_path
                            ));
                        }else if(type == 'Directory'){
                            if(!fs.existsSync(to_entity_path)){
                                fs.mkdirSync(to_entity_path);
                            }
                        }
                    }else{
                        this.app_manager.error(this, "What the hell is this: "  + entity_path);
                        entry.autodrain();
                    }


                }, this))

        }, this)],
        callback
    );
}

_app.prototype._process_exit = function(){
    this.child = null;
    this.app_manager.event({
        type:'exit',
        app:this.toObject(),
        status:'danger',
        message: this._id + ' has exited'
    });
}
_app.prototype._stderr = function(data){
    this.app_manager.error(this, data.toString());
}
_app.prototype._stdout = function(data){
    this.app_manager.log(this, data.toString());
}
_app.prototype.toObject = function(options){
    var obj = _.extend(this.app_data);
    obj._id = this._id;
    if(this.child){
        obj.status = 'running';
    }else{
        obj.status = 'stopped';
    }
    return obj;
}
_app.prototype.log = function(str){
    this.app_manager.log(this, str);
}
_app.prototype.wd = function(){
    if(this.app_data.wd){
        return this.app_data.wd;
    }
    return config.app_dir + '/' + this.app_data.github.repo + '-' + this.branch();
}

_app.prototype.branch = function(){
    return this.app_data.ref || 'master';
}
_app.prototype.is_installed = function(){
    //TODO: Write me
}
_app.prototype.forever_stop = function(callback){
    if(!this.child){
        return callback(new Error("Not running to begin with"));
    }
    this.child.stop()
}