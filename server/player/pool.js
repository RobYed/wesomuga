'use strict';

var crypto = require('crypto'),
    Player = require('./player');


class PlayerPool {

    constructor() {
        this._players = {};
    }

    sendToAll(event, payload) {
        for (var playerId in this._players) {
            this._players[playerId].send(event, payload);
        }
    }

    createPlayer(socket) {
        var player = new Player(socket);

        // add player to player pool
        this._players[player.getId()] = player;

        return player;
    }

    getPlayerById(playerId) {
        if (!this._players.hasOwnProperty(playerId)) {
          return null;
        }
        return this._players[playerId];
    }

    getPlayerBySocket(socket) {
        for (var playerId in this._players) {
            if (this._players[playerId].socket === socket) {
                return this._players[playerId];
            }
        }
      return null;
    }

    getAllPlayerSockets() {
        var playerSockets = [];

        for (var playerId in this._players) {
            playerSockets.push(this._players[playerId]);
        }

        return playerSockets;
    }

    setPlayerName(playerId, name) {
        if (!this._players.hasOwnProperty(playerId)) {
            return false;
        }
        this._players[playerId].setName(name);
        return true;
    }

    removePlayer(socket) {
        var player = this.getPlayerBySocket(socket);

        if (player === null) {
            return;
        }

        delete this._players[player.getId()]; // TODO: return boolean success
    }
}

module.exports = new PlayerPool();