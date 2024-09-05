"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AddRequestPrototype(req, config) {
    const extendedReq = req;
    extendedReq.body = {};
    const { host } = req.headers;
    const parsedUrl = new URL(`http://${host}${req.url}`);
    extendedReq.protocol = config.protocol;
    extendedReq.path = parsedUrl.pathname;
    extendedReq.host = config.host;
    extendedReq.port = config.port;
    extendedReq.query = Object.fromEntries(parsedUrl.searchParams);
    extendedReq.ip = req.socket.remoteAddress;
}
exports.default = AddRequestPrototype;
