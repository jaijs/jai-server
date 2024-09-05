"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routeObjectMaker_1 = __importDefault(require("./routeObjectMaker"));
class TypeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TypeError';
    }
}
const error = (e) => new TypeError(e);
function Router() {
    const routeObj = {
        stack: [],
        addRoute(method, url, ...middleware) {
            if (!url || typeof url !== 'string') {
                throw error(`app.${method.toLowerCase()}() requires a URL string received: ${url} Typeof ${typeof url}`);
            }
            if (middleware.length === 0) {
                throw error(`app.${method.toLowerCase()}() requires middleware function received: nothing`);
            }
            middleware.forEach((mw) => {
                if (typeof mw !== 'function') {
                    throw new TypeError(`app.${method}() requires middleware function received: ${typeof mw}`);
                }
                const isErrorHandler = typeof mw === 'function' && mw.length === 4;
                this.stack.push((0, routeObjectMaker_1.default)({ callback: mw, url, method, isUse: false, isErrorHandler }));
            });
        },
        get(url, ...middleware) {
            this.addRoute('GET', url, ...middleware);
        },
        post(url, ...middleware) {
            this.addRoute('POST', url, ...middleware);
        },
        put(url, ...middleware) {
            this.addRoute('PUT', url, ...middleware);
        },
        delete(url, ...middleware) {
            this.addRoute('DELETE', url, ...middleware);
        },
        options(url, ...middleware) {
            this.addRoute('OPTIONS', url, ...middleware);
        },
        head(url, ...middleware) {
            this.addRoute('HEAD', url, ...middleware);
        },
        use(urlOrMiddleware, ...middleware) {
            const isUse = true;
            const method = null;
            let isErrorHandler = false;
            let callback;
            let url = null;
            const error = (mw) => new TypeError(`app.use() requires middleware function/s or router/s received:${mw} `);
            if (typeof urlOrMiddleware !== 'string' && !urlOrMiddleware) {
                throw error(`${urlOrMiddleware} Typeof ${typeof urlOrMiddleware}`);
            }
            if (typeof urlOrMiddleware === 'string') {
                if (!middleware || middleware.length === 0) {
                    throw error(`${middleware} Typeof  ${middleware.length == 0 ? ' empty array' : typeof middleware}`);
                }
                middleware.forEach((mw) => {
                    url = urlOrMiddleware;
                    callback = mw;
                    if (typeof callback !== 'function' && !(mw.stack)) {
                        throw error(typeof callback);
                    }
                    isErrorHandler = typeof callback === 'function' && callback.length === 4;
                    this.stack.push((0, routeObjectMaker_1.default)({ callback, url, method, isUse, isErrorHandler }));
                });
            }
            else if (typeof urlOrMiddleware === 'function' || urlOrMiddleware.stack) {
                callback = urlOrMiddleware;
                isErrorHandler = typeof callback === 'function' && callback.length === 4;
                this.stack.push((0, routeObjectMaker_1.default)({ callback, url, method, isUse, isErrorHandler }));
                middleware.forEach((mw) => {
                    callback = mw;
                    if (typeof callback !== 'function' && !(mw.stack)) {
                        throw error(typeof callback);
                    }
                    isErrorHandler = typeof callback === 'function' && callback.length === 4;
                    this.stack.push((0, routeObjectMaker_1.default)({ callback, url, method, isUse, isErrorHandler }));
                });
            }
            else {
                throw error(typeof urlOrMiddleware);
            }
        }
    };
    return routeObj;
}
exports.default = Router;
