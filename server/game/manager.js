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

    addPlayerToGame(playerId) {
        var game = this._games.get(this.defaultGameId);

        return game.addPlayer(playerId);
    }

    removePlayerFromGame(playerId) {
        var game = this._games.get(this.defaultGameId);

        return game.removePlayer(playerId);
    }

    updateGame(gameId, updateParams) {

    }

}

module.exports = function() {
    return new GameManager();
};