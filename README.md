NProxy
======
The purpose of this project is to create an admin of sorts for multiple services.

At the moment this is setup for processes running on one server with multiple subdomains or vhosts sitting on it.

##Installing:
###Step 1:
Clone the repo
```clonegit@github.com:schematical/NProxy.git
cd NProxy
npm install
node app.js
```
Now it should be running port 3080

###Config:
For the time being I do not have a dynamic interface for setting up the configuration file. Instead you will have to do it the old fashion way with a text editor. Here is an example:

The config file [./config-sample.js] is well commented to help you get started.




##Random Notes to myself:
###V-Host:
https://www.npmjs.org/package/vhost
https://github.com/visionmedia/express/blob/master/examples/vhost/index.js

###Proxy Server
https://github.com/nodejitsu/node-http-proxy

###Forever Monitor:
https://github.com/nodejitsu/forever-monitor

###Random Debugging Stuff I need not to forget
https://github.com/visionmedia/debug

