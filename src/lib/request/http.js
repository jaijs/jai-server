const http = require('http');

class JaiIncomingHTTP extends http.IncomingMessage {
  constructor(...args) {
    super(...args);

    this.ip = this.socket.remoteAddress;
    this.port = this.socket.address().port;
  }
}

module.exports = JaiIncomingHTTP;
