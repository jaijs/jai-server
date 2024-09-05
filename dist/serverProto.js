"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = require("https");
var http2_1 = require("http2");
var router_1 = require("./lib/router");
var requestBuilder_1 = require("./lib/requestBuilder");
var http_1 = require("http");
var http_2 = require("./lib/response/http");
var http2_2 = require("./lib/response/http2");
var JaiServerFactory = /** @class */ (function () {
    function JaiServerFactory() {
    }
    JaiServerFactory.createJaiServer = function (config, requestHandler) {
        var options = __assign({}, config);
        var serverOptions = this.getServerOptions(options);
        if (options.http2) {
            return this.createHttp2Server(options, serverOptions, requestHandler);
        }
        serverOptions.ServerResponse = http_2.default;
        if (options.https)
            return (0, https_1.createServer)(serverOptions, requestHandler);
        return (0, http_1.createServer)(serverOptions, requestHandler);
    };
    JaiServerFactory.getServerOptions = function (options) {
        var serverOptions = options.https ? { key: options.https.key, cert: options.https.cert } : {};
        options.protocol = options.https ? 'https' : 'http';
        return serverOptions;
    };
    JaiServerFactory.createHttp2Server = function (options, serverOptions, requestHandler) {
        try {
            serverOptions.allowHTTP1 = options.allowHTTP1 !== false;
            if (!options.https)
                return (0, http2_1.createSecureServer)(serverOptions, requestHandler);
            serverOptions.Http1ServerResponse = http_2.default;
            serverOptions.Http2ServerResponse = http2_2.default;
            return (0, http2_1.createSecureServer)(serverOptions, requestHandler);
        }
        catch (e) {
            console.warn('HTTP/2 is not supported, falling back to HTTP/1.1');
            delete serverOptions.Http2ServerResponse;
            delete serverOptions.Http1ServerResponse;
            serverOptions.ServerResponse = http_2.default;
            return options.https
                ? (0, https_1.createServer)(serverOptions, requestHandler)
                : (0, http_1.createServer)(serverOptions, requestHandler);
        }
    };
    return JaiServerFactory;
}());
function createProto(config) {
    var routes = (0, router_1.default)();
    var proto = __assign(__assign({}, routes), { listen: function (port, host) {
            if (host === void 0) { host = config.host || ''; }
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return server.listen.apply(server, __spreadArray([port, host], args, false));
        }, close: function (callback) {
            if (server) {
                server.close(callback);
                server === null || server === void 0 ? void 0 : server.closeAllConnections();
            }
            else {
                callback();
            }
        }, getConfig: function () {
            return __assign({}, config);
        } });
    var requestHandler = (0, requestBuilder_1.default)(config, proto.stack);
    var server = JaiServerFactory.createJaiServer(config, requestHandler);
    return { proto: proto, requestHandler: requestHandler, server: server };
}
exports.default = createProto;
