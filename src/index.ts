import Router from './lib/router';
import createProto from './serverProto';
import AddProtoTypes from './lib/addPrototype';
import jaiBodyParser from 'jai-body-parser';
import JaiStaticMiddleware from 'jai-static';
import { ConfigMain } from './types/types';
import RequestBuilder from './lib/requestBuilder';
interface JaiServerInstance {
  use: (middleware: any) => void;
  // Add other methods as needed
}

const defaultConfig: ConfigMain = {
  host: 'localhost',
  port: 3000,
  static: null,
  httpVersion: '1.1',
  https: undefined,
  http2: false,
  allowHTTP1: true,
  protocol: 'http',
};
function JaiServer(config: ConfigMain = defaultConfig): JaiServerInstance {
  const routes = Router();
  const proto = createProto({
    http2: config.http2,
    https: config.https,
    allowHTTP1: config.allowHTTP1,
    host: config.host,
  },routes);

  const requestHandler = RequestBuilder(config, routes);
  const jaiApp = AddProtoTypes(requestHandler, proto);
  proto.requestHandler = jaiApp;
  jaiApp.requestHandler = requestHandler;


  Object.defineProperty(jaiApp, 'stack', {
      get: () => routes.stack,
      set: (value) => {
        routes.stack = value;
      },
  })

  if (config.static) {

    jaiApp.use(JaiStaticMiddleware(config.static));
  }
  jaiApp.use(jaiBodyParser(config.bodyParser));
  return jaiApp;
}
const Jai_ = AddProtoTypes(JaiServer, { Router })
export default Jai_;