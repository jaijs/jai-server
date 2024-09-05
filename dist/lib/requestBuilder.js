"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_1 = __importDefault(require("./next"));
const httpPrototype_1 = __importDefault(require("./request/httpPrototype"));
const addResponseProto_1 = __importDefault(require("./response/addResponseProto"));
const errorHandler_1 = require("./request/errorHandler");
function RequestBuilder(config, router) {
    return function RequestHandler(req, res) {
        var _a;
        (0, httpPrototype_1.default)(req, config);
        if (!res.JAI)
            (0, addResponseProto_1.default)(res);
        if (req.httpVersion === '2.0') {
            const { headers } = req;
            req.method = headers[':method'];
            req.url = headers[':path'];
            req.httpVersion = headers[':scheme'] === 'https' ? '2.0' : '1.1';
            req.port = req.socket.localPort;
        }
        res.setHeader('X-Powered-By', 'JAI-SERVER');
        (_a = (0, next_1.default)(req, res, 0, router.stack.length, router.stack, '/')()) === null || _a === void 0 ? void 0 : _a.catch((error) => (0, errorHandler_1.ErrorHandler500)(res, error));
    };
}
exports.default = RequestBuilder;
