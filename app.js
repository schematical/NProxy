var express = require('express');
var http = require('http');
var router = require('./routes');
var config = require('./config');
var vhost = require('vhost');
var path = require('path');
var socket_io = require('socket.io');

//
// Create your proxy server and set the target in the options.
//

var app = express();
app.set('port', process.env.PORT || 3080);

app.set('views', path.join(__dirname, 'assets/view'));
app.set('view engine', 'hjs');


app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.errorHandler());
app.use(app.router);


app.configure(function(){
    app.locals.partials = {
        _header:'_header.hjs',
        _footer:'_footer'
    }
    router(app);
});
var server = http.createServer(app).listen(app.get('port'), function(){
    app.io = socket_io.listen(server);

    console.log('Express server listening on port ' + app.get('port'));

    app.io.sockets.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
});

