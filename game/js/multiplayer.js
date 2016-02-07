var Multiplayer = function(config) {

    var socket = new WebSocket('ws://192.168.1.229:4080');

    var inEvents = {
        'register_playerId': onConnectPlayerId.bind(this),
        'register_success': onConnectSuccess.bind(this),
        'game_join_success': onGameJoinSuccess.bind(this),
        'game_join_failure': onGameJoinFailure.bind(this),
        'game_playerjoined': onGamePlayerJoined.bind(this),
        'server_state_update': onServerStateUpdate.bind(this),
    };

    var playerId, gameId, gamesList = null;
    
    var onJoin = function() {};
    
    if (config) {
        onJoin = config.loadGameCallback;
    }

    // Listen for incoming messages
    socket.onmessage = handleIncoming;

    socket.onopen = function() {
        console.log("connected to websocket");
    };

    socket.onerror = function(error) {
        console.warn("websocket error:", error);
    };

    socket.onclose = function() {
        console.warn("disconnected from websocket");
    };

    function handleIncoming(message) {
        // parse JSON if possible
        try {
            var msgObj = JSON.parse(message.data);
        } catch(error) {
            console.warn(error, message);
            return false;
        }

        // check if object is malformed
        if (!msgObj.hasOwnProperty('header') ||
            !msgObj.hasOwnProperty('payload')) {
            return false;
        }

        // call event handler
        if (inEvents.hasOwnProperty(msgObj.header.event)) {
            inEvents[msgObj.header.event](msgObj);
            return true;
        }
        return false;
    }

    function sendMessage(message) {

    }

    function newSocketMessage(event, payload) {
        var msg = {
            header: {
                event: event,
                playerId: playerId
            },
            payload: payload
        };
        return JSON.stringify(msg);
    }

    /////////////////////////////////////////////

    function onConnectPlayerId(msg) {
        playerId = msg.payload.playerId;
        console.log("registered with id ", playerId);
        
        game.data.playerId = playerId;

        respondConnectPlayerName();
    }


    function onConnectSuccess(msg) {
        if (msg.payload.success) {
            console.log("registration successful");
            
            // save games list
            gamesList = msg.payload.games;
            console.log("games available: ", gamesList);
            
            // join first game from list // TODO: let user choose
            joinGame(gamesList[0]);
        }
    }

    function onGameJoinSuccess(msg) {
        // create player objects and add to pool
        console.log("joined game", msg.payload.gameId, msg.payload.players);
        
        game.data.otherPlayers = msg.payload.players;
        
        // load game now
        onJoin();
        
        // start key listener // TODO: move to game start
        game.state.registerKeyListener();
    }
    
    function onGameJoinFailure(msg) {
        console.log("could not join game");
    }

    function onGamePlayerJoined(msg) {
        // add new player to pool
    }
    
    function onServerStateUpdate(msg) {

        game.state.push(msg.payload.stateUpdate);
    }

    /////////////////////////////////////////////

    function respondConnectPlayerName() {

        var msg = newSocketMessage('register_playername', {
            playerName: "GreatestPlayerInTheWorld"
        });

        socket.send(msg);
    }

    function joinGame(gameId) {

        var msg = newSocketMessage('player_join_game', {
            gameId: gameId
        });

        socket.send(msg);
    }
    
    this.sendPlayerUpdate = function(playerUpdate) {
        
        var msg = newSocketMessage('player_state_update', {
            timestamp: Date.now(),
            state: playerUpdate
        });

        socket.send(msg);
    }
};