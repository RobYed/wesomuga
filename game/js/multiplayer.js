var Multiplayer = function(config) {

    var socket = new WebSocket('ws://192.168.1.229:4080');
    
    var UPDATE_INTERVAL = 300;

    var inEvents = {
        'register_playerId': onConnectPlayerId.bind(this),
        'register_success': onConnectSuccess.bind(this),
        'game_join_success': onGameJoinSuccess.bind(this),
        'game_join_failure': onGameJoinFailure.bind(this),
        'game_playerjoined': onGamePlayerJoined.bind(this),
        'server_state_update': onServerStateUpdate.bind(this),
    };

    var playerId, gamesList, gameId = null;
    
    var playerState = new Object();
    
    this.serverState = new Object();
    
    this.serverState.getLatest = function() {
        // return value of latest timestamp
        var latest = 0;
        for (var t in this) {
            var timestamp = parseInt(t);
            if (timestamp > latest) {
                latest = timestamp;
            }
        }
        return this[latest];
    }
    
    var self = this;
    setTimeout(function() {
        console.log(self.serverState.getLatest());
    }, 1200);
    
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
        console.log("joined game", msg.payload.gameId);
        
        // load game now
        onJoin();
        
        // start key listener // TODO: move to game start
        registerKeyListener();
    }
    
    function onGameJoinFailure(msg) {
        console.log("could not join game");
    }

    function onGamePlayerJoined(msg) {
        // add new player to pool
    }
    
    function onServerStateUpdate(msg) {

        var serverStateUpdate = msg.payload.stateUpdate;
        
        for (var stateIndex in serverStateUpdate) {
            var state = serverStateUpdate[stateIndex];
            // save server state
            this.serverState[state.timestamp] = state.state;
        }
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
    
    function sendPlayerUpdate(playerUpdate) {
        
        var msg = newSocketMessage('player_state_update', {
            timestamp: Date.now(),
            state: playerUpdate
        });

        socket.send(msg);
    }
    
    /////////////////////////////////////////////
    
    function registerKeyListener() {
        var self = this;
        
        setInterval(function() {
            var keys = ["left", "right", "jump", "down"];
            var keysPressed = new Object();
        
            // for every key, check if it was pressed
            for (var i=0; i < keys.length; i++) {
                keysPressed[keys[i]] = me.input.isKeyPressed(keys[i]);
            }
            // send player status update to the server
            sendPlayerUpdate(keysPressed);
            
        }, UPDATE_INTERVAL);
    }
};