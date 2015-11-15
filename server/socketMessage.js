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

module.exports = SocketMessage;