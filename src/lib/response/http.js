const http = require('http');
const responsePrototype = require('jai-server/src/lib/response/httpPrototype');

class JaiResponseHTTP extends http.ServerResponse {
  constructor(...req) {
    super(...req);
    Object.assign(this, responsePrototype);
  }
}

module.exports = JaiResponseHTTP;
