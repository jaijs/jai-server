"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AddRequestPrototype(req, config) {
    var extendedReq = req;
    extendedReq.body = {};
    var host = req.headers.host;
    var parsedUrl = new URL("http://".concat(host).concat(req.url));
    extendedReq.protocol = config.protocol;
    extendedReq.path = parsedUrl.pathname;
    extendedReq.host = config.host;
    extendedReq.port = config.port;
    extendedReq.query = Object.fromEntries(parsedUrl.searchParams);
    extendedReq.ip = req.socket.remoteAddress;
}
exports.default = AddRequestPrototype;
