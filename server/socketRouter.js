'use strict';

var gameManager    = require('./gameManager')(),
    SocketMessage  = require('./socketMessage');


class SocketRouter {

    constructor(playerPool) {
        this.inEvents = {
            'register_newplayer': this.onConnectNewPlayer.bind(this),
            'register_playername': this.onConnectPlayerName.bind(this),
            'game_join': this.onGameJoin.bind(this),
        };

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

        // return playerId to player
        var msg = new SocketMessage("register_playerId", {
          playerId: player.getId(),
        });

        socket.send(msg.toJSON());
    }

    onConnectPlayerName(msgObj) {
        var playerId = msgObj.header.playerId;

        var player = this.playerPool.getPlayerById(playerId);

        player.setName(msgObj.payload.playerName);

        console.log("new player registered: ", player.name);

        this.respondConnectSuccess(player.getSocket());
    }

    onGameJoin(msgObj) {
        console.log(msgObj.header.playerId + "joined game");

        var player = playerPool.getPlayerById(msgObj.header.playerId);

        // pass player object to game pool
        // gameManager.addPlayerToGame(player);

        // request active players from game pool
        // var playerList = gameManager.getCurrentPlayers();

        this.respondGameJoinSuccess(player.getSocket(), playerList);
    }

    /////////////////////////////////////////////

    respondConnectSuccess(socket) {
        var msg = new SocketMessage("register_success", {
          success: true,
        });

        socket.send(msg.toJSON());
    }

    respondGameJoinSuccess(socket, playerList) {
        var msg = new SocketMessage("game_joinsuccess", {
          success: true,
          players: playerList,
        });

        socket.send(msg.toJSON());

    }
}

module.exports = function(playerSocket) {
    return new SocketRouter(playerSocket);
};