'use strict';

var crypto = require('crypto');


const GAME_MAX_PLAYER_COUNT = 4;


class Game {

    constructor() {
        this._id = crypto.randomBytes(16).toString('hex');
        this._players = new Array();
        this._createDate = new Date();

        this._unprocessedPlayerStates = new Array();
        this._processedPlayerStates = new Array();

        console.log("new game created: ", this._id);
    }

    getId() {
        return this._id;
    }
    
    getPlayers() {        
        return this._players;
    }

    addPlayer(playerId) {

        if (this._players.length >= GAME_MAX_PLAYER_COUNT) {
            return false;
        }

        this._players.push(playerId);
        return true;
    }

    removePlayer(playerId) {
        
        var playerIndex = this._players.indexOf(playerId);

        // check if player exists
        if (playerIndex == -1) {
            return false;
        }
        
        // remove player from _players
        this._players.splice(playerIndex, 1);
       
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