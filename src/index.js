/* eslint-disable  global-require */
const Router = require('jai-server/src/lib/router');
const defaultConfig = require('jai-server/src/config');
const JaiRequestBuilder = require('jai-server/src/lib/requestBuilder');
const getProto = require('jai-server/src/serverProto');

const AddProtoTypes = require('jai-server/src/lib/addPrototype');
const jaiBodyParser = require('jai-body-parser');


function JaiServer(options={}) {
  // let server = null;
  const config = {
    ...defaultConfig, ...options,
  };
  const protoType= getProto(config);
  const requestHandler = JaiRequestBuilder( config, protoType.stack);
  const jaiApp  = AddProtoTypes(requestHandler, protoType);

  if (config.static) {
    const JaiStatic = require('jai-static');
    jaiApp.use(JaiStatic(options.static));
  }
  jaiApp.use(jaiBodyParser(options.bodyParser));
  return jaiApp;

}




module.exports = (AddProtoTypes(JaiServer, {Router}));
/* eslint-disable  global-require */
