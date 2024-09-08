import Router from './lib/router';
import createProto from './serverProto';
import AddProtoTypes from './lib/addPrototype';
import jaiBodyParser from 'jai-body-parser';
import JaiStaticMiddleware from 'jai-static';
import { JaiServerConfig } from './types/types';
import RequestBuilder from './lib/requestBuilder';
interface JaiServerInstance {
  use: (middleware: any) => void;
  // Add other methods as needed
}

const defaultConfig: JaiServerConfig = {
  host: 'localhost',
  port: 3000,
  static: null,
  httpVersion: '1.1',
  https: undefined,
  http2: false,
  allowHTTP1: true,
  protocol: 'http',
  timeout: 60000,
};
function JaiServer(config: JaiServerConfig): JaiServerInstance {
  if(!config)config = defaultConfig;
  config = { ...defaultConfig, ...config };
  const routes = Router();
  const proto = createProto(config,routes);

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
module.exports = Jai_;