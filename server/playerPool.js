'use strict';

var Player = require('./player');


class PlayerPool {

    constructor() {
        this.players = {};
    }

    createPlayer(socket) {
        var player = new Player(socket);

        // add player to player pool
        this.players[player.getId()] = player;

        return player;
    }

    getPlayerById(playerId) {
        if (!this.players.hasOwnProperty(playerId)) {
          return null;
        }
        return this.players[playerId];
    }

    getPlayerBySocket(socket) {
        for (var playerId in this.players) {
            if (this.players[playerId].socket === socket) {
                return this.players[playerId];
            }
        }
      return null;
    }

    getAllPlayerSockets() {
        var playerSockets = [];

        for (var playerId in this.players) {
            playerSockets.push(this.players[playerId]);
        }

        return playerSockets;
    }

    setPlayerName(playerId, name) {
        if (!this.players.hasOwnProperty(playerId)) {
            return false;
        }
        this.players[playerId].setName(name);
        return true;
    }

    removePlayer(socket) {
        var player = this.getPlayerBySocket(socket);

        if (player === null) {
            return;
        }

        delete this.players[player.getId()];
    }
}

module.exports = new PlayerPool();