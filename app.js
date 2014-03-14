var express = require('express');
var http = require('http');
var router = require('./routes');
var config = require('./config');
var vhost = require('vhost');
var path = require('path');
var socket = require('./lib/socket');
var fs = require('fs');

//
// Create your proxy server and set the target in the options.
//

var app = express();
app.set('port', process.env.PORT || 3080);

app.set('views', path.join(__dirname, 'assets/view'));
app.set('view engine', 'hjs');
app.engine('html', function(path, options, callback){
    var html = fs.readFileSync(path, 'utf8');
    return callback(null, html);
});

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
    console.log('Express server listening on port ' + app.get('port'));
    socket.listen(server, app);
});

