'use strict';

var gameManager    = require('../game/manager')();
var EVENTS         = require('./events');


class SocketRouter {

    // TODO: add _ as private indicator

    constructor(playerPool) {
        this._inEvents = new Object();
        this._inEvents[EVENTS.IN.REGISTER_NEW_PLAYER] = this.onConnectNewPlayer.bind(this);
        this._inEvents[EVENTS.IN.REGISTER_PLAYERNAME] = this.onConnectPlayerName.bind(this);
        this._inEvents[EVENTS.IN.PLAYER_GAME_JOIN] = this.onGameJoin.bind(this);
        this._inEvents[EVENTS.IN.PLAYER_STATE_UPDATE] = this.onStateUpdate.bind(this);

        this._playerPool = playerPool;
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
        if (this._inEvents.hasOwnProperty(msgObj.header.event)) {
            this._inEvents[msgObj.header.event](msgObj);
            return true;
        }

        return false;
    }

    /////////////////////////////////////////////

    onConnectNewPlayer(socket) {
        // create new player
        var player = this._playerPool.createPlayer(socket);

        player.send(EVENTS.OUT.REGISTER_PLAYER_ID, {
          playerId: player.getId(),
        });
    }

    onConnectPlayerName(msgObj) {
        var playerId = msgObj.header.playerId;

        var player = this._playerPool.getPlayerById(playerId);

        player.setName(msgObj.payload.playerName);

        console.log("new player registered: ", player.getName());

        player.send(EVENTS.OUT.PLAYER_REGISTER_SUCCESS, {
          success: true,
          games: gameManager.getGamesList()
        });
    }

    onGameJoin(msgObj) {
        console.log(msgObj.header.playerId + "joined game");

        var player = this._playerPool.getPlayerById(msgObj.header.playerId);

        // pass player object to game pool
        var joinSuccess = gameManager.addPlayerToGame(player, msgObj.payload.gameId);

        // request active players from game pool
        // var playerList = gameManager.getCurrentPlayers();
        
        console.log(joinSuccess ? player.getName()+" joined game "+msgObj.payload.gameId : "join failed!");

        if (joinSuccess) {
            player.send(EVENTS.OUT.GAME_JOIN_SUCCESS, {
                gameId: msgObj.payload.gameId
                // players: playerList,
            });
        } else {
            player.send(EVENTS.OUT.GAME_JOIN_FAILURE, {
                // players: playerList,
            });
        }
        
    }
    
    onStateUpdate(msgObj) {
                
        var player = this._playerPool.getPlayerById(msgObj.header.playerId);
        
        var stateUpdate = new Object();
        stateUpdate[msgObj.payload.timestamp] = msgObj.payload.state;
        
        player.send(EVENTS.OUT.SERVER_STATE_UPDATE, {
            stateUpdate: stateUpdate
        });
    }

}

module.exports = function(playerSocket) {
    return new SocketRouter(playerSocket);
};