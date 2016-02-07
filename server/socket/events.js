'use strict';

var events = {
    IN: new Object(),
    OUT: new Object()
};

events.IN.REGISTER_NEW_PLAYER = 'register_newplayer';
events.IN.REGISTER_PLAYERNAME = 'register_playername';
events.IN.PLAYER_GAME_JOIN = 'player_join_game';
events.IN.PLAYER_STATE_UPDATE = 'player_state_update';

events.OUT.REGISTER_PLAYER_ID = 'register_playerId';
events.OUT.PLAYER_REGISTER_SUCCESS = 'register_success';
events.OUT.GAME_JOIN_SUCCESS = 'game_join_success'
events.OUT.GAME_JOIN_FAILURE = 'game_join_failure'
events.OUT.SERVER_STATE_UPDATE = 'server_state_update';


const EVENTS = events;

module.exports = EVENTS;