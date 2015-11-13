'use strict';

var crypto = require('crypto');

class Player {

    constructor(socket) {
        this.id = crypto.randomBytes(16).toString('hex');
        this.name = "player_" + this.id;
        this.socket = socket;
        console.log(this.name, "added");
    }

    getId() {
        return this.id;
    }

    setName(name) {
        if (typeof name !== "string") {
        return false;
        }
        this.name = name;
    return true;
    }

    toString() {
      return this.name;
    }

    toJSON() {
        var obj = {
          id: this.id,
          name: this.name,
          socket: this.socket
        };
        return JSON.stringify(obj);
    }
}

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