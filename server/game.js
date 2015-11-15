'use strict';

var crypto = require('crypto');


const GAME_MAX_PLAYER_COUNT = 4;


class Game {

    constructor() {
        this._id = crypto.randomBytes(16).toString('hex');
        this._players = [];
        this._status = []; // uses same index as players
        this._createDate = new Date();

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
        this._status.push({}); // TODO: check if more initial data required
        return false;
    }

    removePlayer(playerId) {

        // check if player exists
        if (this._players.indexOf(playerId) == -1) {
            return false;
        }

        // TODO: remove player from _players
        // TODO: remove player status from _status
    }

    getGameStatus() {
        return this._status;
    }

    updateGameStatus(gameStatus) {

        if (gameStatus.length !== this._players.length) {
            return false;
        }

        // TODO: more validity checks
        this._status = gameStatus;
        return true;
    }

    updatePlayerStatus(playerId, playerStatus) {

        var playerIndex = this._players.indexOf(playerId);

        // check if player exists
        if (playerIndex == -1) {
            return false;
        }

        // TODO: more validity checks
        this._status[playerIndex] = playerStatus;
        return true;
    }
}

module.exports = Game;