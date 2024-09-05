"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./lib/router"));
const serverProto_1 = __importDefault(require("./serverProto"));
const addPrototype_1 = __importDefault(require("./lib/addPrototype"));
const jai_body_parser_1 = __importDefault(require("jai-body-parser"));
const jai_static_1 = __importDefault(require("jai-static"));
const defaultConfig = {
    host: 'localhost',
    port: 3000,
    static: null,
    httpVersion: '1.1',
    https: undefined,
    http2: false,
    allowHTTP1: true,
    protocol: 'http',
};
function JaiServer(config = defaultConfig) {
    const { proto, requestHandler } = serverProto_1.default.bind({})({
        http2: config.http2,
        https: config.https,
        allowHTTP1: config.allowHTTP1,
        host: config.host,
    });
    const jaiApp = (0, addPrototype_1.default)(requestHandler, proto);
    jaiApp.stack = proto.stack;
    if (config.static) {
        jaiApp.use((0, jai_static_1.default)(config.static));
    }
    jaiApp.use((0, jai_body_parser_1.default)(config.bodyParser));
    return jaiApp;
}
const Jai_ = (0, addPrototype_1.default)(JaiServer, { Router: router_1.default });
module.exports = Jai_;
