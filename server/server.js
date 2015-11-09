var engine = require('engine.io');
var server = engine.listen(3000);

var players = [];

server.on('connection', function(socket){

  var socketNumber = players.push(socket);

  socket.send('player'+socketNumber);

  sendAll('player'+socketNumber+' connected');

  console.log('player'+socketNumber+' connected');
});

function sendAll(msg) {
  for (var i = players.length - 1; i >= 0; i--) {
    players[i].send(msg);
  }
}