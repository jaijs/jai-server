import { createServer as createServerHttps, ServerOptions as HttpsServerOptions } from 'https';
import  {createSecureServer as createServerHttp2, SecureServerOptions, ServerOptions as Http2ServerOptions} from 'http2';
import Router from './lib/router';
import  JaiRequestBuilder  from './lib/requestBuilder';
import  { ServerResponse , createServer as createServerHttp, Server as ServerHttp,ServerOptions as  HttpServerOptions} from 'http';
import { JaiServerConfig, JaiServer ,JaiProto, RequestHandlerExtended} from './types/types';
import ServerResponseHttp from './lib/response/http'
import ServerResponseHttp2 from './lib/response/http2'

class JaiServerFactory {
  constructor() {}
  static createJaiServer(config: JaiServerConfig, requestHandler:RequestHandlerExtended ): JaiServer {
    const options = { ...config };
    const serverOptions = this.getServerOptions(options);
 

    if (options.http2) {
      return this.createHttp2Server(options, serverOptions, requestHandler);
    }
    serverOptions.ServerResponse = ServerResponseHttp 
    if (options.https)return createServerHttps(serverOptions as HttpsServerOptions, requestHandler);
    return createServerHttp(serverOptions as HttpServerOptions,requestHandler);
  }

  static getServerOptions(options: JaiServerConfig): HttpServerOptions &JaiServerConfig | HttpsServerOptions &JaiServerConfig  | Http2ServerOptions&JaiServerConfig {
    const serverOptions: HttpsServerOptions | Http2ServerOptions = options.https ? { key: options.https.key, cert: options.https.cert } : {};
    options.protocol = options.https ? 'https' : 'http';
    return serverOptions;
  }

  static createHttp2Server(options: JaiServerConfig, serverOptions: HttpServerOptions&JaiServerConfig |Http2ServerOptions&JaiServerConfig, requestHandler: (req: any, res: any) => void): JaiServer
   {
    try {
      serverOptions.allowHTTP1 = options.allowHTTP1 !== false;
      if(!options.https) return createServerHttp2(serverOptions as SecureServerOptions, requestHandler);

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


function createProto(config: JaiServerConfig): {proto:JaiProto, requestHandler: RequestHandlerExtended, server: JaiServer} {
  const routes = Router();


  const proto = {
    ...routes,
    listen(port: number, host: string = config.host || '', ...args: any[]): JaiServer {
     

         return server.listen(port, host, ...args);
        

       
    },
    close(callback: () => void): any {
      if (server) {
         server.close(callback);
         (server as ServerHttp)?.closeAllConnections()
      } else {
        callback();
      }
    },
    getConfig(): JaiServerConfig {
      return { ...config };
    },
  };
  const requestHandler = JaiRequestBuilder(config, proto.stack)
  const server: JaiServer =JaiServerFactory.createJaiServer(config, requestHandler);
  return {proto, requestHandler, server};
}

export default createProto;