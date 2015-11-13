'use strict';

class SocketMessage {

  constructor(event, payload) {
    this.header = { event: event };
    this.payload = payload;
  }

  toJSON() {
    var msg = {
        header: this.header,
        payload: this.payload
    };
    return JSON.stringify(msg);
  }
}

class SocketRouter {

    constructor(playerPool) {
        this.inEvents = {
            'register_newplayer': this.onConnectNewPlayer.bind(this),
            'register_playername': this.onConnectPlayerName.bind(this)
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

        this.respondConnectSuccess(player.socket);
    }

    /////////////////////////////////////////////

    respondConnectSuccess(socket) {
        var msg = new SocketMessage("register_success", {
          success: true,
        });

        socket.send(msg.toJSON());
    }
}

module.exports = function(playerSocket) {
    return new SocketRouter(playerSocket);
}