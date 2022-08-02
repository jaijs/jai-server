/* eslint-disable  global-require */
const defaultConfig = require('./config');
const JaiRequestBuilder = require('./lib/requestBuilder');
const Router = require('./lib/router');
const AddProtoTypes = require('./lib/addPrototype');

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
        server = http.createSecureServer(serverOptions, JaiRequestBuilder(stack, options));
      } else {
        serverOptions.Http1IncomingMessage = require('./lib/request/http');
        serverOptions.Http1ServerResponse = require('./lib/response/http');
        serverOptions.Http2ServerRequest = require('./lib/request/http2');
        serverOptions.Http2ServerResponse = require('./lib/response/http2');
        server = http.createServer(serverOptions, JaiRequestBuilder(stack, options));
      }

      options.httpVersion = '2.0';
    } catch (e) {
      options.http2 = false;
      console.log('HTTP/2 is not supported');
      // if not supported, fallback to HTTP/1.1
      delete serverOptions.allowHTTP1;
      http = options.https ? require('https') : require('http');
      server = http.createServer(serverOptions, JaiRequestBuilder(stack, options));
    }
  } else if (options.https) {
    // Enable HTTPS 1.1
    http = require('https');
    serverOptions.IncomingMessage = require('./lib/request/http');
    serverOptions.ServerResponse = require('./lib/response/http');
    server = http.createServer(serverOptions, JaiRequestBuilder(stack, options));
  } else {
    // Enable HTTP 1.1
    http = require('http');
    serverOptions.IncomingMessage = require('./lib/request/http');
    serverOptions.ServerResponse = require('./lib/response/http');
    server = http.createServer(serverOptions, JaiRequestBuilder(stack, options));
  }

  return server;
}

function Init(options) {
  // let server = null;
  const config = {
    ...defaultConfig, ...options,
  };

  const protoType = {
    ...new Router(),
    listen(...args) {
      // config.port = port || config.port;
      // config.host = host || config.host;
      this.server = new CreateServer(config, this.stack);
      this.server.listen(...args);
      return this.server;
    },
    close(callback) {
      if (this.server) {
        this.server.close(callback);
      } else {
        callback();
      }
    },
    router: Router,
    getConfig() {
      return config;
    },
  };

  const requestHandler = JaiRequestBuilder(protoType.stack, options);
  return AddProtoTypes(requestHandler, protoType);
}

function JaiServer(options = {}) {
  const jaiApp = new Init(options);
  if (options.static) {
    const JaiStatic = require('jai-static');
    jaiApp.use(JaiStatic(options.static));
  }
  return jaiApp;
}

const jaiProto = {
  _: {
    Router,
  },
  Router() { return new this._.Router(); },
};
module.exports = AddProtoTypes(JaiServer, jaiProto);
/* eslint-disable  global-require */
