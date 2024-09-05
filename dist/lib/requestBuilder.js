"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var next_1 = require("./next");
var httpPrototype_1 = require("./request/httpPrototype");
var addResponseProto_1 = require("./response/addResponseProto");
var errorHandler_1 = require("./request/errorHandler");
function RequestBuilder(config, stack) {
    return function RequestHandler(req, res) {
        var _a;
        (0, httpPrototype_1.default)(req, config);
        if (!res.JAI)
            (0, addResponseProto_1.default)(res);
        if (req.httpVersion === '2.0') {
            // Handle HTTP/2
            var headers = req.headers;
            req.method = headers[':method'];
            req.url = headers[':path'];
            req.httpVersion = headers[':scheme'] === 'https' ? '2.0' : '1.1';
            req.port = req.socket.localPort;
        }
        res.setHeader('X-Powered-By', 'JAI-SERVER');
        (_a = (0, next_1.default)(req, res, 0, stack.length, stack, '/')()) === null || _a === void 0 ? void 0 : _a.catch(function (error) { return (0, errorHandler_1.ErrorHandler500)(res, error); });
    };
}
exports.default = RequestBuilder;
