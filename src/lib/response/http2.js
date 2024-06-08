const http2 = require('http2');
const responsePrototype = require('jai-server/src/lib/response/httpPrototype');

class JaiResponseHTTP2 extends http2.Http2ServerResponse {
  constructor(...stream) {
    super(...stream);
    console.log('JaiResponseHTTP2', typeof this);
    Object.assign(this, responsePrototype);
  }
}

module.exports = JaiResponseHTTP2;
