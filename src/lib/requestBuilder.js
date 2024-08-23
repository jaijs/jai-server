const Next = require('./next');
const AddRequestPrototype = require('./request/httpPrototype');
const errorHandler = require('./request/errorHandler');

const AddResponsePrototype = require('./response/addResponseProto');

function RequestBuilder(config, stack) {

  return function RequestHandler(req, res) {
    // add response prototype
    // const stack = this.stack;
    req.body = {};

    AddRequestPrototype(req, config);
    AddResponsePrototype(res)


    if (req.httpVersion === '2.0') {
      // handle HTTP2 with stream API
      // return;

      // stream the request
      const { headers } = req;
      req.method = headers[':method'];
      req.url = headers[':path'];
      req.httpVersion = headers[':scheme'] === 'https' ? '2.0' : '1.1';
      this.port = this.socket.localPort;
    }


    res.set('X-Powered-By', 'JAI-SERVER');


    Next(req, res, 0, stack.length, stack, '/', true

    )()?.
      catch(res, errorHandler)
  };
}

module.exports = RequestBuilder;
