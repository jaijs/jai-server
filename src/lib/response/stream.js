const http2 = require('http2');
const responsePrototype = require('./streamPrototype');

class JaiResponseHTTP2Stream extends http2.Http2Stream {
  constructor(...args) {
    super(...args);
    Object.assign(this, responsePrototype);
  }
}

module.exports = JaiResponseHTTP2Stream;
