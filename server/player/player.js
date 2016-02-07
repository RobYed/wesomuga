'use strict';

var crypto          = require('crypto'),
    SocketMessage   = require('../socket/message');


class Player {

    constructor(socket) {
        this._id = crypto.randomBytes(16).toString('hex');
        this._name = "player_" + this._id;
        this._socket = socket;
        this._currentGame = null;

        console.log(this._name, "added");
    }

    send(event, payload) {
        var msg = new SocketMessage(event, payload);

        this._socket.send(msg.toJSON());
    }

    getId() {
        return this._id;
    }

    getSocket() {
        return this._socket;
    }

    getName() {
        return this._name;
    }

    setName(name) {
        if (typeof name !== "string") {
            return false;
        }
        this._name = name;
        return true;
    }
    
    setCurrentGame(gameId) {
        this._currentGame = gameId;
    }

    toString() {
      return this._name;
    }

    toJSON() {
        var obj = {
          id: this._id,
          name: this._name,
          socket: this._socket
        };
        return JSON.stringify(obj);
    }
}

module.exports = Player;