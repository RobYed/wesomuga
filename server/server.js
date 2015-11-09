var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

players = {};


io.on('connection', function (socket) {

  var playerId = Math.round(Math.random()*10000, 5);

  players[playerId] = socket;

  socket.emit('playerid', playerId);
  io.emit('message', 'player '+playerId+' connected');
  console.log('player '+playerId+' connected');

  socket.on('update', function (data) {
    io.emit('update', data);
  });

});

console.log('started socket server');