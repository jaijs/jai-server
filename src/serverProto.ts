import { createServer as createServerHttps, ServerOptions as HttpsServerOptions } from 'https';
import { createSecureServer as createServerHttp2, SecureServerOptions, ServerOptions as Http2ServerOptions } from 'http2';

//import JaiRequestBuilder from './lib/requestBuilder';
import { ServerResponse, createServer as createServerHttp, Server as ServerHttp, ServerOptions as HttpServerOptions } from 'http';
import { JaiServerConfig, JaiServer, JaiProto, RequestHandlerExtended, Router } from './types/types';
import ServerResponseHttp from './lib/response/http'
import ServerResponseHttp2 from './lib/response/http2'
import RequestBuilder from './lib/requestBuilder';

class JaiServerFactory {
  constructor() { }
  static createJaiServer(config: JaiServerConfig, routes:Router): JaiServer {
    const options = { ...config };
    const serverOptions = this.getServerOptions(options);

    const requestHandler: RequestHandlerExtended = RequestBuilder(options, routes);
    if (options.http2) {
      return this.createHttp2Server(options, serverOptions, requestHandler);
    }
    serverOptions.ServerResponse = ServerResponseHttp
    if (options.https) return createServerHttps(serverOptions as HttpsServerOptions, requestHandler);
    return createServerHttp(serverOptions as HttpServerOptions, requestHandler);
  }

  static getServerOptions(options: JaiServerConfig): HttpServerOptions & JaiServerConfig | HttpsServerOptions & JaiServerConfig | Http2ServerOptions & JaiServerConfig {
    const serverOptions: HttpsServerOptions | Http2ServerOptions = options.https ? { key: options.https.key, cert: options.https.cert } : {};
    options.protocol = options.https ? 'https' : 'http';
    return serverOptions;
  }

  static createHttp2Server(options: JaiServerConfig, serverOptions: HttpServerOptions & JaiServerConfig | Http2ServerOptions & JaiServerConfig, requestHandler: (req: any, res: any) => void): JaiServer {
    try {
      serverOptions.allowHTTP1 = options.allowHTTP1 !== false;
      if (!options.https) return createServerHttp2(serverOptions as SecureServerOptions, requestHandler);

      serverOptions.Http1ServerResponse = ServerResponseHttp as typeof ServerResponse;
      serverOptions.Http2ServerResponse = ServerResponseHttp2
      return createServerHttp2(serverOptions, requestHandler);
    } catch (_e) {
      console.warn('HTTP/2 is not supported, falling back to HTTP/1.1');
      console.warn(_e);
      delete serverOptions.Http2ServerResponse
      delete serverOptions.Http1ServerResponse
      serverOptions.ServerResponse = ServerResponseHttp
      return options.https
        ? createServerHttps(serverOptions as HttpsServerOptions, requestHandler)
        : createServerHttp(serverOptions as HttpServerOptions, requestHandler);
    }
  }
}


function createProto(config: JaiServerConfig, routes:Router): JaiProto {


  const proto = {
    ...routes,
    listen(port: number, host: string = config.host || '', ...args: any[]): JaiServer {
     // console.log('listen', this.requestHandler, this.requestHandler.stack);
      const server: JaiServer = JaiServerFactory.createJaiServer(config, routes);
      this.server = server;
      return this.server.listen(port, host, ...args);


    },
    close(callback: () => void): any {
      if (this.server) {
        this.server.close(callback);
        (this.server as ServerHttp)?.closeAllConnections()
      } else {
        callback();
      }
    },
    getConfig(): JaiServerConfig {
      return { ...config };
    },
  };


  return proto
}

export default createProto;