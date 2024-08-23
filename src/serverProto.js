const Router = require('./lib/router');
const JaiRequestBuilder = require('./lib/requestBuilder');
const https = require('https');
const http = require('http');
const http2 = require('http2');

class JaiServerFactory {
  static createServer(config, stack) {
    const options = { ...config };
    const serverOptions = this.getServerOptions(options);
    const requestHandler = JaiRequestBuilder(options, stack);

    if (options.http2) {
      return this.createHttp2Server(options, serverOptions, requestHandler);
    }
    if (options.https) {
      return https.createServer(serverOptions, requestHandler);
    }
    return http.createServer(requestHandler);
  }

  static getServerOptions(options) {
    const serverOptions = options.https ? { key: options.https.key, cert: options.https.cert } : {};
    options.protocol = options.https ? 'https' : 'http';
    return serverOptions;
  }

  static createHttp2Server(options, serverOptions, requestHandler) {
    try {
      serverOptions.allowHTTP1 = options.allowHTTP1 !== false;
      return options.https
        ? http2.createSecureServer(serverOptions, requestHandler)
        : http2.createServer(requestHandler);
    } catch (e) {
      console.warn('HTTP/2 is not supported, falling back to HTTP/1.1');
      return options.https
        ? https.createServer(serverOptions, requestHandler)
        : http.createServer(requestHandler);
    }
  }
}

function createProto(config) {
  const routes = Router();
  let server = null;

  return {
    ...routes,
    listen(port, host = config.host, ...args) {
      server = JaiServerFactory.createServer(config, this.stack);
      server.listen(port, host, ...args);
      return server;
    },
    close(callback) {
      if (server) {
        server.close(callback);
      } else {
        callback();
      }
    },
    getConfig() {
      return { ...config };
    },
  };
}

module.exports = createProto;