"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./lib/router");
var serverProto_1 = require("./serverProto");
var addPrototype_1 = require("./lib/addPrototype");
var jai_body_parser_1 = require("jai-body-parser");
var jai_static_1 = require("jai-static");
var defaultConfig = {
    host: 'localhost',
    port: 3000,
    static: null,
    httpVersion: '1.1',
    https: undefined,
    http2: false,
    allowHTTP1: true,
    protocol: 'http',
};
function JaiServer(config) {
    if (config === void 0) { config = defaultConfig; }
    var _a = serverProto_1.default.bind({})({
        http2: config.http2,
        https: config.https,
        allowHTTP1: config.allowHTTP1,
        host: config.host,
    }), proto = _a.proto, requestHandler = _a.requestHandler;
    var jaiApp = (0, addPrototype_1.default)(requestHandler, proto);
    jaiApp.stack = proto.stack;
    if (config.static) {
        jaiApp.use((0, jai_static_1.default)(config.static));
    }
    jaiApp.use((0, jai_body_parser_1.default)(config.bodyParser));
    return jaiApp;
}
var Jai_ = (0, addPrototype_1.default)(JaiServer, { Router: router_1.default });
exports.default = Jai_;
