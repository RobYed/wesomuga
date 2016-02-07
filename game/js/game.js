/**
 * main
 */
var game = {

    /**
     * object where to store game global data
     */
    data : {
        // score
        score : 0,
        playerId: null,
        otherPlayers: {},
    },

    multiplayer: new Multiplayer({
        loadGameCallback: function() {
            // load everything & display a loading screen
            me.state.change(me.state.LOADING);
        }
    }),
    
    state: new GameState(),

    /**
     *
     * Initialize the application
     */
    onload: function() {

        // init the video
        if (!me.video.init(800, 600, {wrapper : "screen", scale : "auto", scaleMethod : "flex-width" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Set some default debug flags
        me.debug.renderHitBox = true;

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // initialize the "sound engine"
        me.audio.init("mp3,ogg");

        // set all ressources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // set all ressources to be loaded
        me.loader.preload(game.resources);

        /*
        game.socket.on('new_player', function(playerSettings) {
            console.log(playerSettings.nickname+' joined the game', playerSettings.pos.x, playerSettings.pos.y);

            if (playerSettings.playerId !== game.data.playerId) {
                // programmatically add new player
                game.data.otherPlayers[playerSettings.playerId] = me.pool.pull("otherPlayer", playerSettings.pos.x, playerSettings.pos.y);
                me.game.world.addChild(game.data.otherPlayers[playerSettings.playerId]);
            }
        });

        game.socket.on('game_update', function(playerSettings) {

            if (playerSettings.playerId !== game.data.playerId) {
                game.data.otherPlayers[playerSettings.playerId].pos.x = playerSettings.pos.x;
                game.data.otherPlayers[playerSettings.playerId].pos.y = playerSettings.pos.y;

                game.data.otherPlayers[playerSettings.playerId].body.vel.x = playerSettings.vel.x;
                game.data.otherPlayers[playerSettings.playerId].body.vel.y = playerSettings.vel.y;

                game.data.otherPlayers[playerSettings.playerId].body.update();
            }

        });

        game.socket.on('disconnect', function(){
            console.log('disconnected from websocket server');
        });

        */
    },


    /**
     * callback when everything is loaded
     */
    loaded: function ()    {

        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // set the fade transition effect
        me.state.transition("fade","#FFFFFF", 250);

        // register our objects entity in the object pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("otherPlayer", game.OtherPlayerEntity);
        me.pool.register("SlimeEntity", game.SlimeEnemyEntity);
        me.pool.register("FlyEntity", game.FlyEnemyEntity);
        me.pool.register("CoinEntity", game.CoinEntity);

        // load the texture atlas file
        // this will be used by object entities later
        game.texture = new me.video.renderer.Texture(
            me.loader.getJSON("texture"),
            me.loader.getImage("texture")
        );

        // add some keyboard shortcuts
        me.event.subscribe(me.event.KEYDOWN, function (action, keyCode /*, edge */) {

            // change global volume setting
            if (keyCode === me.input.KEY.PLUS) {
                // increase volume
                me.audio.setVolume(me.audio.getVolume()+0.1);
            } else if (keyCode === me.input.KEY.MINUS) {
                // decrease volume
                me.audio.setVolume(me.audio.getVolume()-0.1);
            }

            // toggle fullscreen on/off
            if (keyCode === me.input.KEY.F) {
                if (!me.device.isFullscreen) {
                    me.device.requestFullscreen();
                } else {
                    me.device.exitFullscreen();
                }
            }
        });

        // switch to PLAY state
        me.state.change(me.state.PLAY);
    }
};
