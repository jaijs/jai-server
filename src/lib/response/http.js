const http = require('http');
const responsePrototype = require('./httpPrototype');

class JaiResponseHTTP extends http.ServerResponse {
  constructor(...req) {
    super(...req);
    Object.assign(this, responsePrototype);
  }
}

module.exports = JaiResponseHTTP;
