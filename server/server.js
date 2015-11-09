var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

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