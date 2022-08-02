const http2 = require('http2');

class JaiIncomingHTTP2 extends http2.Http2ServerRequest {
  constructor(socket) {
    super(socket);
    this.ip = this.socket.remoteAddress;
    this.port = this.socket.localPort;
  }
}

module.exports = JaiIncomingHTTP2;
