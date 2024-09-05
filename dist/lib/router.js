"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var routeObjectMaker_1 = require("./routeObjectMaker");
var TypeError = /** @class */ (function (_super) {
    __extends(TypeError, _super);
    function TypeError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'TypeError';
        return _this;
    }
    return TypeError;
}(Error));
var error = function (e) { return new TypeError(e); };
// type callbacks={
//   stack:RouteObject[]
// }
function Router() {
    var routeObj = {
        stack: [],
        addRoute: function (method, url) {
            var _this = this;
            var middleware = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                middleware[_i - 2] = arguments[_i];
            }
            if (!url || typeof url !== 'string') {
                throw error("app.".concat(method.toLowerCase(), "() requires a URL string received: ").concat(url, " Typeof ").concat(typeof url));
            }
            if (middleware.length === 0) {
                throw error("app.".concat(method.toLowerCase(), "() requires middleware function received: nothing"));
            }
            // const callbacks:callbacks={stack:[]};
            middleware.forEach(function (mw) {
                if (typeof mw !== 'function') {
                    throw new TypeError("app.".concat(method, "() requires middleware function received: ").concat(typeof mw));
                }
                var isErrorHandler = typeof mw === 'function' && mw.length === 4;
                _this.stack.push((0, routeObjectMaker_1.default)({ callback: mw, url: url, method: method, isUse: false, isErrorHandler: isErrorHandler }));
            });
            // this.stack.push(RouteObjectMaker({callback:callbacks, url, method, isUse:false,isErrorHandler:false}));
        },
        get: function (url) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            this.addRoute.apply(this, __spreadArray(['GET', url], middleware, false));
        },
        post: function (url) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            this.addRoute.apply(this, __spreadArray(['POST', url], middleware, false));
        },
        put: function (url) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            this.addRoute.apply(this, __spreadArray(['PUT', url], middleware, false));
        },
        delete: function (url) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            this.addRoute.apply(this, __spreadArray(['DELETE', url], middleware, false));
        },
        options: function (url) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            this.addRoute.apply(this, __spreadArray(['OPTIONS', url], middleware, false));
        },
        head: function (url) {
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            this.addRoute.apply(this, __spreadArray(['HEAD', url], middleware, false));
        },
        use: function (urlOrMiddleware) {
            var _this = this;
            var middleware = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middleware[_i - 1] = arguments[_i];
            }
            var isUse = true;
            var method = null;
            var isErrorHandler = false;
            var callback;
            var url = null;
            var error = function (mw) { return new TypeError("app.use() requires middleware function/s or router/s received:".concat(mw, " ")); };
            if (typeof urlOrMiddleware !== 'string' && !urlOrMiddleware) {
                throw error("".concat(urlOrMiddleware, " Typeof ").concat(typeof urlOrMiddleware));
            }
            if (typeof urlOrMiddleware === 'string') { // with URL
                if (!middleware || middleware.length === 0) {
                    throw error("".concat(middleware, " Typeof  ").concat(middleware.length == 0 ? ' empty array' : typeof middleware));
                }
                middleware.forEach(function (mw) {
                    url = urlOrMiddleware;
                    callback = mw;
                    if (typeof callback !== 'function' && !(mw.stack)) {
                        throw error(typeof callback);
                    }
                    isErrorHandler = typeof callback === 'function' && callback.length === 4;
                    _this.stack.push((0, routeObjectMaker_1.default)({ callback: callback, url: url, method: method, isUse: isUse, isErrorHandler: isErrorHandler }));
                });
            }
            else if (typeof urlOrMiddleware === 'function' || urlOrMiddleware.stack) {
                // First middleware is the callback
                callback = urlOrMiddleware;
                isErrorHandler = typeof callback === 'function' && callback.length === 4;
                this.stack.push((0, routeObjectMaker_1.default)({ callback: callback, url: url, method: method, isUse: isUse, isErrorHandler: isErrorHandler }));
                // Rest of the middleware are added as middleware GLOBAL/ Without URL
                middleware.forEach(function (mw) {
                    callback = mw;
                    if (typeof callback !== 'function' && !(mw.stack)) {
                        throw error(typeof callback);
                    }
                    isErrorHandler = typeof callback === 'function' && callback.length === 4;
                    _this.stack.push((0, routeObjectMaker_1.default)({ callback: callback, url: url, method: method, isUse: isUse, isErrorHandler: isErrorHandler }));
                });
            }
            else { // Error
                throw error(typeof urlOrMiddleware);
            }
        }
    };
    return routeObj;
}
exports.default = Router;
