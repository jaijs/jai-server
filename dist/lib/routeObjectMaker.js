"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function RouteObjectMaker(_a) {
    var callback = _a.callback, _b = _a.url, url = _b === void 0 ? null : _b, _c = _a.method, method = _c === void 0 ? null : _c, _d = _a.isUse, isUse = _d === void 0 ? false : _d, _e = _a.isErrorHandler, isErrorHandler = _e === void 0 ? false : _e;
    return {
        url: url,
        method: method,
        handler: callback,
        isUse: isUse,
        isErrorHandler: isErrorHandler
    };
}
exports.default = RouteObjectMaker;
