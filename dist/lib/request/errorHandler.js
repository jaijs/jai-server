"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler500 = void 0;
var ErrorHandler500 = function (res, error) {
    error = error instanceof Error ? error : error === null || error === void 0 ? void 0 : error.toString();
    console.log(error);
    if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ statusCode: 500, message: 'Internal Server Error - Jai Server', error: (error === null || error === void 0 ? void 0 : error.message) || error }));
        res.end();
    }
};
exports.ErrorHandler500 = ErrorHandler500;
