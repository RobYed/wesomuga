'use strict';

class SocketMessage {

  constructor(event, payload) {
    this._header = {
      event: event,
      dateSent: new Date()
    };
    this._payload = payload;
  }

  toJSON() {
    var msg = {
        header: this._header,
        payload: this._payload
    };
    return JSON.stringify(msg);
  }
}

module.exports = SocketMessage;