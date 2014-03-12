var async = require('async');
var app_manager = require('../lib/app_manager');
module.exports = function(app){
    return function(req, res, next){
        app_manager.list(function (err, data) {
            if(err) return next(err);
            console.log(data);
/*
            [ { ctime: 1394634903904,
                command: '/usr/local/bin/node',
                file: 'app.js',
                foreverPid: 19854,
                options: [ '--port', 3002 ],
                pid: 19890,
                silent: true,
                uid: 'x',
                spawnWith: { cwd: '/var/www/fish_tank', env: [Object] },
                running: true,
                env: 'development',
                cwd: '/var/www/fish_tank',
                socket: '/home/user1a/.forever/sock/worker.1394634902189-6v.sock' } ]
*/

            res.render('app_list', {

            })
        });
    }
}