"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const matcher_1 = __importDefault(require("./matcher"));
const routeObjectMaker_1 = __importDefault(require("./routeObjectMaker"));
const errorHandler_1 = require("./request/errorHandler");
function isHandlerFunction(handler) {
    return typeof handler === 'function';
}
function isHandlerObject(handler) {
    return typeof handler === 'object' && Array.isArray(handler.stack);
}
function Next(req, res, i, mwLength, stack, contUrl = '/') {
    return async function NextHandler(nextError) {
        try {
            for (; i <= mwLength - 1; i++) {
                const middleware = stack[i];
                if (!middleware)
                    continue;
                const { url, isUse, method, handler, isErrorHandler } = middleware;
                let urlMatched;
                let params = {};
                let nextUrl = contUrl;
                if (url) {
                    const urls = Array.isArray(url) ? url : [url];
                    for (let j = 0; j < urls.length; j++) {
                        const u = urls[j];
                        if (u == null) {
                            urlMatched = true;
                            break;
                        }
                        nextUrl = path.join(contUrl, u);
                        params = (0, matcher_1.default)(nextUrl, req.url.split('?')[0], !isUse && isHandlerFunction(handler));
                        if (params) {
                            urlMatched = true;
                            break;
                        }
                    }
                }
                else
                    urlMatched = true;
                const methodMatched = req.method === method || !method;
                if (!urlMatched || !methodMatched)
                    return await Next(req, res, i + 1, mwLength, stack, contUrl)(nextError);
                if (isHandlerFunction(handler)) {
                    req.params = params;
                    const nextFunction = Next(req, res, i + 1, mwLength, stack, contUrl);
                    if (!nextError && isErrorHandler) {
                        return await nextFunction(nextError);
                    }
                    else {
                        try {
                            if (nextError && !isErrorHandler)
                                return await nextFunction(nextError);
                            const args = [];
                            if (nextError && isErrorHandler)
                                args.push(nextError);
                            args.push(req, res, nextFunction);
                            return await handler(...args);
                        }
                        catch (error) {
                            return await nextFunction(error);
                        }
                    }
                }
                else if (isHandlerObject(handler)) {
                    const routerStack = [
                        ...handler.stack,
                        (0, routeObjectMaker_1.default)({
                            callback: async (err, req, res) => {
                                await Next(req, res, i + 1, mwLength, stack, contUrl)(err || nextError);
                            },
                            url: null, method: null, isUse: true, isErrorHandler: true
                        }),
                        (0, routeObjectMaker_1.default)({
                            callback: async (req, res) => {
                                await Next(req, res, i + 1, mwLength, stack, contUrl)(nextError);
                            },
                            url: null, method: null, isUse: true, isErrorHandler: false
                        }),
                    ];
                    await Next(req, res, 0, routerStack.length, routerStack, isUse ? nextUrl : contUrl)(nextError);
                }
            }
            if (!res.headersSent) {
                if (nextError)
                    throw nextError;
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ statusCode: 404, error: 'Not Found', message: 'Not Found' }));
            }
        }
        catch (error) {
            (0, errorHandler_1.ErrorHandler500)(res, error);
        }
    };
}
exports.default = Next;
