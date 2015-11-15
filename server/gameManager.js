'use strict';

var crypto = require('crypto'),
    Game = require('./game');


class GameManager {

    // TODO: add support for multiple games

    constructor() {
        this._games = {};

        // ONLY TEMPORARY
        this.defaultGameId = this.newGame();
    }

    newGame() {
        var newGame = new Game(),
            newGameId = newGame.getId();

        this._games[newGameId] = newGame;

        return newGameId;
    }

    addPlayerToGame(playerObj) {

    }

    removePlayerFromGame(playerObj) {

    }

    updateGame(gameId, updateParams) {

    }

}

module.exports = function() {
    return new GameManager();
};