/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.json());
  app.use(express.urlencoded());  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

console.log("Express server listening on port 3000");

//////////////////////////
//Socket.io on 
//////////////////////////

var serverSwitchStatus;

io.sockets.on('connection', function (socket) {
    //Update new clients with switch status on connection
    console.log('A new user connected!');
    console.log(typeof(serverSwitchStatus));
    if(typeof serverSwitchStatus != 'undefined') {
      socket.emit('updateSoftwareSwitches', serverSwitchStatus); 
      console.log("SERVER SWITCH STATUS SENT: " + serverSwitchStatus )
    }

    //Update all clients except submitting client of switch changes
    socket.on('updateHardwareSwitches', function (switchJson) {
      serverSwitchStatus = switchJson;
      console.log("Received from client:" + switchJson);
      socket.broadcast.emit('updateSoftwareSwitches', switchJson);  //Update connected clients

    //Update ardiono hardware
    //turn JSON back into javascript array
    // Example:  var receivedSwitchStatus=JSON.parse(data);
    //var switchStatus=JSON.parse(switchJson);
    });

});
