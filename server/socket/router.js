'use strict';

var gameManager    = require('../game/manager')();
var EVENTS         = require('./events');


class SocketRouter {

    // TODO: add _ as private indicator

    constructor(playerPool) {
        this.inEvents = new Object();
        this.inEvents[EVENTS.IN.REGISTER_NEW_PLAYER] = this.onConnectNewPlayer.bind(this);
        this.inEvents[EVENTS.IN.REGISTER_PLAYERNAME] = this.onConnectPlayerName.bind(this);
        this.inEvents[EVENTS.IN.PLAYER_GAME_JOIN] = this.onGameJoin.bind(this);

        this.playerPool = playerPool;
    }

    handleIncoming(message) {

        // parse JSON if possible
        try {
            var msgObj = JSON.parse(message);
        } catch(error) {
            console.warn(error);
            return false;
        }

        // check if object is malformed
        if (!msgObj.hasOwnProperty('header') ||
            !msgObj.hasOwnProperty('payload')) {
            return false;
        }

        // call event handler
        if (this.inEvents.hasOwnProperty(msgObj.header.event)) {
            this.inEvents[msgObj.header.event](msgObj);
            return true;
        }

        return false;
    }

    /////////////////////////////////////////////

    onConnectNewPlayer(socket) {
        // create new player
        var player = this.playerPool.createPlayer(socket);

        player.send(EVENTS.OUT.REGISTER_PLAYER_ID, {
          playerId: player.getId(),
        });
    }

    onConnectPlayerName(msgObj) {
        var playerId = msgObj.header.playerId;

        var player = this.playerPool.getPlayerById(playerId);

        player.setName(msgObj.payload.playerName);

        console.log("new player registered: ", player.getName());

        player.send(EVENTS.OUT.PLAYER_REGISTER_SUCCESS, {
          success: true,
        });
    }

    onGameJoin(msgObj) {
        console.log(msgObj.header.playerId + "joined game");

        var player = playerPool.getPlayerById(msgObj.header.playerId);

        // pass player object to game pool
        // gameManager.addPlayerToGame(player);

        // request active players from game pool
        // var playerList = gameManager.getCurrentPlayers();

        player.send(EVENTS.OUT.GAME_JOIN_SUCCESS, {
          success: true,
          players: playerList,
        });
    }

}

module.exports = function(playerSocket) {
    return new SocketRouter(playerSocket);
};