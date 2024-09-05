"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const http2_1 = require("http2");
const router_1 = __importDefault(require("./lib/router"));
const requestBuilder_1 = __importDefault(require("./lib/requestBuilder"));
const http_1 = require("http");
const http_2 = __importDefault(require("./lib/response/http"));
const http2_2 = __importDefault(require("./lib/response/http2"));
class JaiServerFactory {
    constructor() { }
    static createJaiServer(config, requestHandler) {
        const options = { ...config };
        const serverOptions = this.getServerOptions(options);
        if (options.http2) {
            return this.createHttp2Server(options, serverOptions, requestHandler);
        }
        serverOptions.ServerResponse = http_2.default;
        if (options.https)
            return (0, https_1.createServer)(serverOptions, requestHandler);
        return (0, http_1.createServer)(serverOptions, requestHandler);
    }
    static getServerOptions(options) {
        const serverOptions = options.https ? { key: options.https.key, cert: options.https.cert } : {};
        options.protocol = options.https ? 'https' : 'http';
        return serverOptions;
    }
    static createHttp2Server(options, serverOptions, requestHandler) {
        try {
            serverOptions.allowHTTP1 = options.allowHTTP1 !== false;
            if (!options.https)
                return (0, http2_1.createSecureServer)(serverOptions, requestHandler);
            serverOptions.Http1ServerResponse = http_2.default;
            serverOptions.Http2ServerResponse = http2_2.default;
            return (0, http2_1.createSecureServer)(serverOptions, requestHandler);
        }
        catch (_e) {
            console.warn('HTTP/2 is not supported, falling back to HTTP/1.1');
            console.warn(_e);
            delete serverOptions.Http2ServerResponse;
            delete serverOptions.Http1ServerResponse;
            serverOptions.ServerResponse = http_2.default;
            return options.https
                ? (0, https_1.createServer)(serverOptions, requestHandler)
                : (0, http_1.createServer)(serverOptions, requestHandler);
        }
    }
}
function createProto(config) {
    const routes = (0, router_1.default)();
    const proto = {
        ...routes,
        listen(port, host = config.host || '', ...args) {
            return server.listen(port, host, ...args);
        },
        close(callback) {
            if (server) {
                server.close(callback);
                server === null || server === void 0 ? void 0 : server.closeAllConnections();
            }
            else {
                callback();
            }
        },
        getConfig() {
            return { ...config };
        },
    };
    const requestHandler = (0, requestBuilder_1.default)(config, proto.stack);
    const server = JaiServerFactory.createJaiServer(config, requestHandler);
    return { proto, requestHandler, server };
}
exports.default = createProto;
