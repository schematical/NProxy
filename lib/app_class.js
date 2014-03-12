var async = require('async');
var forever = require('forever');
var _ = require('underscore');
var vhost = require('vhost');
var http_proxy = require('http-proxy');
var GitHubApi = require('github');
var fs = require('fs');
var request = require('request');
var unzip = require('unzip');
var npm = require("npm");
module.exports = _app = function(app_id, app_data, app_manager){
    this._id = app_id;
    this.app_data = app_data;
    this.app_data_manager = app_manager;
    return this;
}
_app.prototype.deploy = function(app, callback){
    async.series([
        _.bind(this.pull_code_full, this),
        _.bind(this.npm_install, this),
        _.bind(this.launch, this),
        _.bind(function(next){   this.start_proxy(app, next);  }, this),
        callback
    ]);
}
_app.prototype.npm_install = function(callback){

    npm.load({}, function (err) {
        if (err) {
            console.error(err);
            return callback(err)
        }
        npm.commands.install([], function (err, data) {
            if (err) {
                console.error(err);
                return callback(err)
            }
            // command succeeded, and data might have some info
            console.log("NPM SUCCESS: ");
            console.log(data);
            callback();
        })
        npm.on("log", function (message) {
            console.log('NPM: ' + message);
        })
    })
}
_app.prototype.launch = function(callback){

    this.child = child = new (forever.Monitor) (this.app_data.script, {
        options: [/*'--port', this.app_data.route.to.port*/],
        silent: true,
        env: { 'PORT': this.app_data.route.to.port },
        uid:(this.app_data.process && this.app_data.process.id) || this._id,
        cwd: this.app_data.wd,
        logFile: '../_test/' + this._id + '.log'
    });


    this.child.on('start', _.bind(function (err, data) {
     /*   if(err) {
            console.error(err);
            return callback(err);
        }*/
        this.child.child.stderr.on('data', _.bind(this._stderr, this));
        this.child.child.stdout.on('data', _.bind(this._stdout, this));
        console.log("Server Started");

        forever.startServer(child, callback);
    }, this));

    this.child.on('exit', _.bind(this._process_exit, this));
    this.child.start();

}

_app.prototype.pull_code_full = function(callback){
    /*var github = new GitHubApi({
        // required
        version: "3.0.0",
        // optional
        debug: true,
    *//*    protocol: "https",
        host: "github.my-GHE-enabled-company.com",
        pathPrefix: "/api/v3", // for some GHEs*//*
        timeout: 5000
    });
    return github.repos.getContent(this.app_data.github, function(err, content){
        return callback();
    });*/
    var branch =  this.app_data.ref || 'master';
    var quick_name = this.app_data.github.repo + '-' + branch;
    var tmp = quick_name + '.zip';
    var app_dir = config.app_dir |  __dirname + '/../apps';
    var deploy_to_dir = app_dir + quick_name;//TODO: Make this a unique dir

    async.series([
        _.bind(function(next){

            var url = 'https://github.com/' + this.app_data.github.user + '/' + this.app_data.github.repo + '/archive/';
            url += branch;
            url += '.zip';
            var stream = fs.createWriteStream(tmp);
            request(url).pipe(stream);
            stream.on('finish', next);
        }, this),
        _.bind(function(next){
            fs.createReadStream(tmp)
                .pipe(unzip.Parse())
                .on('entry', function (entry) {

                    var entity_path = entry.path;
                    var type = entry.type; // 'Directory' or 'File'
                    var size = entry.size;
                    if(entity_path.substr(0, quick_name.length) == quick_name){
                        var to_entity_path =  deploy_to_dir + entity_path.substr(quick_name.length);
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
                        console.error("What the hell is this: "  + entity_path);
                        entry.autodrain();
                    }
                    entry.on('end', next);

                })

        }, this)],
        callback
    );
}
_app.prototype.start_proxy = function(app, callback){
    console.log('Rounting - From: ' + this.app_data.route.from.alias + ' -  To: ' + this.app_data.route.to.host + ':' + this.app_data.route.to.port);


    this.proxy_server = http_proxy.createProxyServer({
        target: this.app_data.route.to.host + ':' + this.app_data.route.to.port
    });
    app.use(vhost(this.app_data.route.from.alias, this.proxy_server)); // Serves top level domain via Main server app'
    return callback();
}
_app.prototype._process_exit = function(){
    console.log(this.app.name + ' has exited');
}
_app.prototype._stderr = function(data){
    console.error(data.toString());
}
_app.prototype._stdout = function(data){
    console.log(data.toString());
}