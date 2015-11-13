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
            'connect_newplayer': this.onConnectNewPlayer,
            'connect_playername': this.onConnectPlayerName
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

        // find event handler
        for (var event in this.inEvents) {
            if (this.inEvents.hasOwnProperty(event)) {
                this.inEvents[event](msgObj);
                return true;
            }
        }
        return false;
    }

    onConnectNewPlayer(socket) {
        console.log('client connected');

        var player = this.playerPool.createPlayer(socket);

        // return playerId to player
        var msg = new SocketMessage("connect_playerId", {
          playerId: player.getId(),
        });

        socket.send(msg.toJSON());
    }

    onConnectPlayerName(msgObj) {
        var playerId = msgObj.header.playerId;

        var player = this.playerPool.getPlayerById(playerId);

        player.setName(msgObj.payload.playerName);
    }
}

module.exports = function (playerPool) {
    return new SocketRouter(playerPool);
};