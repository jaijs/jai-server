const Router = require('jai-server/src/lib/router');
const JaiRequestBuilder = require('jai-server/src/lib/requestBuilder');

function CreateServer(config, stack) {
  const options = config;
  let server = null;
  let http = null;
  const serverOptions = {};

  if (options.https) {
    serverOptions.key = options.https.key;
    serverOptions.cert = options.https.cert;
  }
  options.protocol = options.https ? 'https' : 'http';
  if (options.http2) {
    try {
      // Enable HTTP/2
      serverOptions.allowHTTP1 = options.allowHTTP1 !== false;
      http = require('http2');
      if (options.https) {
        server = http.createSecureServer(serverOptions, JaiRequestBuilder(options, stack));
      } else {
        serverOptions.Http1IncomingMessage = require('jai-server/src/lib/request/http');
        serverOptions.Http1ServerResponse = require('jai-server/src/lib/response/http');
        serverOptions.Http2ServerRequest = require('jai-server/src/lib/request/http2');
        serverOptions.Http2ServerResponse = require('jai-server/src/lib/response/http2');
        server = http.createServer(serverOptions, JaiRequestBuilder(options,stack));
      }

      options.httpVersion = '2.0';
    } catch (e) {
      options.http2 = false;
      console.log('HTTP/2 is not supported');
      // if not supported, fallback to HTTP/1.1
      delete serverOptions.allowHTTP1;
      http = options.https ? require('https') : require('http');
      server = http.createServer(serverOptions, JaiRequestBuilder(options, stack));
    }
  } else if (options.https) {
    // Enable HTTPS 1.1
    http = require('https');
    serverOptions.IncomingMessage = require('jai-server/src/lib/request/http');
    serverOptions.ServerResponse = require('jai-server/src/lib/response/http');
    server = http.createServer(serverOptions, JaiRequestBuilder(options, stack));
  } else {
    // Enable HTTP 1.1
    http = require('http');
    serverOptions.IncomingMessage = require('jai-server/src/lib/request/http');
    serverOptions.ServerResponse = require('jai-server/src/lib/response/http');
    server = http.createServer(serverOptions, JaiRequestBuilder(options, stack));
  }

  return server;
}

function getProto(config) {
  const routes = Router();
   //routes.stack= undefined;
  // Hide stack from console.log

  const protoType = {
      ...routes ,
    listen(port,host=config.host,...args) {
      // config.port = port || config.port;
      // config.host = host || config.host;
      this.server = new CreateServer(config, this.stack);
      this.server.listen(port,host,...args);
      return this.server;
    },
    close(callback) {
      if (this.server) {
        this.server.close(callback);
      } else {
        callback();
      }
    },
    //   router: Router,
    getConfig() {
      return config;
    },

  };


  return protoType;
}


module.exports = getProto;