'use strict';

var crypto = require('crypto'),
    Game = require('./game');


class GameManager {

    // TODO: add support for multiple games

    constructor() {
        this._games = new Map();

        // ONLY TEMPORARY
        this.defaultGameId = this.newGame();
    }

    newGame() {
        var newGame = new Game(),
            newGameId = newGame.getId();

        this._games.set(newGameId, newGame);

        return newGameId;
    }
    
    getGame(gameId) {
        return this._games.get(gameId);
    }

    addPlayerToGame(player, gameId) {
        var game = this._games.get(gameId);
        
        // check if game with given id was found
        if (!game) {
            return false;
        }
        
        // get sure, player will be removed when connection is lost
        var self = this;
        var playerSocket = player.getSocket();
        var playerId = player.getId();
        playerSocket.on('close', function() {
            self.removePlayerFromGame(playerId, gameId);
        });
        
        return game.addPlayer(playerId);
    }

    removePlayerFromGame(playerId, gameId) {
        var game = this._games.get(gameId);
        
        // check if game with given id was found
        if (!game) {
            return false;
        }
        return game.removePlayer(playerId);
    }
    
    getGamesList() {
        return Array.from(this._games.keys());
    }

    updateGame(gameId, updateParams) {

    }

}

module.exports = function() {
    return new GameManager();
};