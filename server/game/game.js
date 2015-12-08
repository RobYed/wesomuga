'use strict';

var crypto = require('crypto');


const GAME_MAX_PLAYER_COUNT = 4;


class Game {

    constructor() {
        this._id = crypto.randomBytes(16).toString('hex');
        this._players = [];
        this._createDate = new Date();

        this._unprocessedPlayerStates = [];
        this._processedPlayerStates = [];

        console.log("new game created: ", this._id);
    }

    getId() {
        return this._id;
    }

    addPlayer(playerId) {

        if (this._player.length >= GAME_MAX_PLAYER_COUNT) {
            return false;
        }

        this._players.push(playerId);
        // this._status.addNewPlayerState(playerId, {}); // TODO: check if more initial data required
        return false;
    }

    removePlayer(playerId) {

        // check if player exists
        if (this._players.indexOf(playerId) == -1) {
            return false;
        }

        // TODO: remove player from _players
        // TODO: remove player status from _status
        return true;
    }

    addPlayerUpdate(playerId, playerUpdate) {

        var playerIndex = this._players.indexOf(playerId);

        // check if player exists
        if (playerIndex == -1) {
            return false;
        }

        // TODO: more validity checks
        this._status[playerIndex] = playerUpdate;
        return true;
    }
}

module.exports = Game;