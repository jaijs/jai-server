const Next = require('jai-server/src/lib/next');
const AddRequestPrototype = require('jai-server/src/lib/request/httpPrototype');
const addPrototype = require('jai-server/src/lib/addPrototype');
const responsePrototype = require('jai-server/src/lib/response/httpPrototype');

async function Request(req, res, stack) {
  try {
    res.set('X-Powered-By', 'JAI-SERVER');
    const mwLength = stack.length;
    return await Next(req, res, 0, mwLength, stack)();
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ statusCode: 500, error: 'Internal Server Error - Jai Server', message: error.message }));
      res.end();
    }
  }
}

function RequestBuilder(config, stack) {
 
  return function RequestHandler(req, res) {
    
    // add response prototype
   // const stack = this.stack;
    req.body = {};
    addPrototype(res, responsePrototype);

    if ((config.http2 && config.https) || req.httpVersion === '2.0') {

      req.ip = req.socket.remoteAddress;
      req.port = req.socket.localPort;
      if (req.httpVersion === '2.0') {
        // handle HTTP2 with stream API
        // return;

        // stream the request
        const { headers } = req;
        req.method = headers[':method'];
        req.url = headers[':path'];
        req.httpVersion = headers[':scheme'] === 'https' ? '2.0' : '1.1';
        AddRequestPrototype(req, config);
        return Request(req, res, stack);
      }
    }

    AddRequestPrototype(req, config);
    return Request(req, res, stack);
  };
}

module.exports = RequestBuilder;
