'use strict';

var crypto = require('crypto');


class Player {

    constructor(socket) {
        this._id = crypto.randomBytes(16).toString('hex');
        this._name = "player_" + this.id;
        this._socket = socket;

        console.log(this._name, "added");
    }

    getId() {
        return this._id;
    }

    getSocket() {
        return this._socket;
    }

    setName(name) {
        if (typeof name !== "string") {
            return false;
        }
        this._name = name;
        return true;
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