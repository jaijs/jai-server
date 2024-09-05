"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function RouteObjectMaker({ callback, url = null, method = null, isUse = false, isErrorHandler = false }) {
    return {
        url,
        method,
        handler: callback,
        isUse,
        isErrorHandler
    };
}
exports.default = RouteObjectMaker;
