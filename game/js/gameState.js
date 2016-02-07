var GameState = function(config) {
    
    console.log("new GameState");
    
    var UPDATE_INTERVAL = 90;

    var _serverState = new Object();
    
    // index positions of latest state updates
    var latestServerState = null;
    
    this.push = push;
    this.getLatest = getLatest;
    this.registerKeyListener = registerKeyListener;
    
    ////////////////////////
    
    function push(stateUpdate) {
        
        for (var timestamp in stateUpdate) {
            // save server state
            _serverState[timestamp] = stateUpdate[timestamp];
            latestServerState = timestamp;
        }
    }
    
    function getLatest(doRemove) {
        
        if (!latestServerState) {
            return null;
        }
        return _serverState[latestServerState];
    }
    
    function registerKeyListener() {
        
        setInterval(function() {
            var keys = ["left", "right", "jump", "down"];
            var keysPressed = new Object();
        
            // for every key, check if it was pressed
            for (var i=0; i < keys.length; i++) {
                keysPressed[keys[i]] = me.input.isKeyPressed(keys[i]);
            }
            // send player status update to the server
            game.multiplayer.sendPlayerUpdate(keysPressed);
            
        }, UPDATE_INTERVAL);
    }

}
