NProxy
======
The purpose of this project is to create an admin of sorts for multiple services.

At the moment this is setup for processes running on one server with multiple subdomains or vhosts sitting on it.

###Example:

` REQUEST: your_first_app.com:80 => localhost:3001 `
` REQUEST: your_second_app.com:80 => localhost:3002 `

I realize other non node tools exist for this purpos but screw it I wanted to add in [forever](https://github.com/nodejitsu/forever) and some other fun.

##Installing:

```clonegit@github.com:schematical/NProxy.git
cd NProxy
npm install
node app.js
```
Now it should be running port **3080**

###Config:
For the time being I do not have a dynamic interface for setting up the configuration file. Instead you will have to do it the old fashion way with a text editor. Here is an example:

The [config file](./config-sample.js) is well commented to help you get started.

__NOTE: Make sure to restart the server each time you edit the config file__

##Road Map:
I would like to make this a full blown tool to make running a node box easier and make it easier to maintain. Feel free to fork contribute or what have you.
Thanks!


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

