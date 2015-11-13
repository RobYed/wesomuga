var Multiplayer = function() {

    var socket = new WebSocket('ws://192.168.1.229:4080');

    var inEvents = {
        "connect_playerId": onConnectPlayerId,
        "connect_success": onConnectSuccess
    };

    // Listen for incoming messages
    socket.onmessage = handleMessage;

    socket.onopen = function() {
        console.log("connected to websocket");
    };

    socket.onerror = function(error) {
        console.warn("websocket error:", error);
    };

    socket.onclose = function() {
        console.warn("disconnected from websocket");
    };

    function handleMessage(message) {
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

        // find event handler
        for (var event in inEvents) {
            if (inEvents.hasOwnProperty(event)) {
                inEvents[event](msgObj);
                return true;
            }
        }
        return false;
    }

    function sendMessage(message) {

    }

    function onConnectPlayerId(msg) {
        console.log("onConnectPlayerId", msg);
    }

    function onConnectSuccess(msg) {

    }
};