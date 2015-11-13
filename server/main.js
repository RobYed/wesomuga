'use strict';
/////////////////////////////////////////////////
// IMPORTS
/////////////////////////////////////////////////
var server          = require('http').createServer(),
    url             = require('url'),
    express         = require('express'),
    WebSocketServer = require('ws').Server;


var playerPool      = require('./players'),
    socketRouter    = require('./socket')(playerPool);


/////////////////////////////////////////////////
// SETUP
/////////////////////////////////////////////////
var wss = new WebSocketServer({ server: server }),
    app = express(),
    port = 4080;


wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  socketRouter.onConnectNewPlayer(ws);

  // CONNECTION CLOSED
  ws.on('close', function close() {
    playerPool.removePlayer(ws);
    console.log('client disconnected');
  });

  // MESSAGE RECEIVED
  ws.on('message', function incoming(message) {

    if (typeof message !== "string") {
      console.warn('received malformed message');
      return;
    }

    socketRouter.handleIncoming(message);
  });

});

/////////////////////////////////////////////////
// STARTUP
/////////////////////////////////////////////////
app.use(function (req, res) {
  res.send({ msg: "hello" });
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port); });







/*



var players = {};

var games = {
  1: {
    players: {}
  }
};


io.on('connection', function (socket) {

  newPlayerId = registerNewPlayer(socket);

  // listen for player registration
  socket.on('join_game', function(playerSettings) {
    addPlayerToGame(newPlayerId, playerSettings);
  });

  socket.on('player_update', function(playerUpdate) {
    emitToAllButOne('game_update', playerUpdate, playerUpdate.playerId);
  });

  socket.on('disconnect', function() {
    for (var playerId in players) {
      if (players[playerId] === socket) {
        unregisterPlayer(playerId);
        removePlayerFromGame(playerId);
        console.log("player with id "+playerId+" disconnected");
      }
    }
  });

});

///// SOCKET MANAGEMENT /////

function registerNewPlayer(socket) {
  // create player id
  var playerId = Math.round(Math.random()*10000000, 8);

  // add player's socket to player list
  players[playerId] = socket;

  // return playerId to player
  socket.emit('register_player', playerId);

  console.log("new player with id "+playerId);

  return playerId;
}

function unregisterPlayer(playerId) {
  delete players[playerId];
}

///// GAME MANAGEMENT /////

function addPlayerToGame(playerId, playerSettings) {

  games[1].players[playerId] = playerSettings;

  var message = playerSettings.nickname+' joined the game';

  console.log(message);

  emitToAllButOne('new_player', playerSettings, playerId);
}

function removePlayerFromGame(playerId) {
  delete games[1].players[playerId];
}


///// HELPER METHODS /////

function emitToAllButOne(event, data, exceptionPlayerId) {
  for (var playerId in players) {
    console.log("playerId: ", playerId, ", exceptionPlayerId: ", exceptionPlayerId);
    if (playerId !== exceptionPlayerId) {
      players[playerId].emit(event, data);
    }
  }
}

console.log('started socket server');

*/