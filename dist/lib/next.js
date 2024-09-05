"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var path = require("path");
var matcher_1 = require("./matcher");
var routeObjectMaker_1 = require("./routeObjectMaker");
var errorHandler_1 = require("./request/errorHandler");
// Type guard to check if handler is a function
function isHandlerFunction(handler) {
    return typeof handler === 'function';
}
// Type guard to check if handler is an object with a stack property
function isHandlerObject(handler) {
    return typeof handler === 'object' && Array.isArray(handler.stack);
}
function Next(req, res, i, mwLength, stack, contUrl) {
    if (contUrl === void 0) { contUrl = '/'; }
    return function NextHandler(nextError) {
        return __awaiter(this, void 0, void 0, function () {
            var middleware, url, isUse, method, handler, isErrorHandler, urlMatched, params, nextUrl, urls, j, u, methodMatched, nextFunction, args, error_1, routerStack, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 16, , 17]);
                        _a.label = 1;
                    case 1:
                        if (!(i <= mwLength - 1)) return [3 /*break*/, 15];
                        middleware = stack[i];
                        if (!middleware)
                            return [3 /*break*/, 14];
                        url = middleware.url, isUse = middleware.isUse, method = middleware.method, handler = middleware.handler, isErrorHandler = middleware.isErrorHandler;
                        urlMatched = void 0;
                        params = {};
                        nextUrl = contUrl;
                        // nextError && console.log(1, { nextError, url, method, nextUrl, contUrl, isUse, isErrorHandler });
                        if (url) {
                            urls = Array.isArray(url) ? url : [url];
                            for (j = 0; j < urls.length; j++) {
                                u = urls[j];
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
                            urlMatched = true; // USE
                        methodMatched = req.method === method || !method;
                        if (!(!urlMatched || !methodMatched)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Next(req, res, i + 1, mwLength, stack, contUrl)(nextError)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        if (!isHandlerFunction(handler)) return [3 /*break*/, 12];
                        req.params = params;
                        nextFunction = Next(req, res, i + 1, mwLength, stack, contUrl);
                        if (!(!nextError && isErrorHandler)) return [3 /*break*/, 5];
                        return [4 /*yield*/, nextFunction(nextError)]; // Bypass the current error handler
                    case 4: // NO ERROR
                    return [2 /*return*/, _a.sent()]; // Bypass the current error handler
                    case 5:
                        _a.trys.push([5, 9, , 11]);
                        if (!(nextError && !isErrorHandler)) return [3 /*break*/, 7];
                        return [4 /*yield*/, nextFunction(nextError)];
                    case 6: return [2 /*return*/, _a.sent()]; // MOVE TO NEXT MIDDLEWARE
                    case 7:
                        args = [];
                        if (nextError && isErrorHandler)
                            args.push(nextError); // ERROR HANDLER
                        args.push(req, res, nextFunction);
                        return [4 /*yield*/, handler.apply(void 0, args)];
                    case 8: return [2 /*return*/, _a.sent()]; // Normal flow
                    case 9:
                        error_1 = _a.sent();
                        return [4 /*yield*/, nextFunction(error_1)];
                    case 10: return [2 /*return*/, _a.sent()];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        if (!isHandlerObject(handler)) return [3 /*break*/, 14];
                        routerStack = __spreadArray(__spreadArray([], handler.stack, true), [
                            (0, routeObjectMaker_1.default)({
                                callback: function (err, req, res) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            //console.log(101, err)
                                            return [4 /*yield*/, Next(req, res, i + 1, mwLength, stack, contUrl)(err || nextError)]; // Attach the previus error 
                                            case 1:
                                                //console.log(101, err)
                                                _a.sent(); // Attach the previus error 
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                                url: null, method: null, isUse: true, isErrorHandler: true
                            }),
                            (0, routeObjectMaker_1.default)({
                                callback: function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            //console.log(2, "No error")
                                            return [4 /*yield*/, Next(req, res, i + 1, mwLength, stack, contUrl)(nextError)]; // Normal flow without Error
                                            case 1:
                                                //console.log(2, "No error")
                                                _a.sent(); // Normal flow without Error
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                                url: null, method: null, isUse: true, isErrorHandler: false
                            }),
                        ], false);
                        return [4 /*yield*/, Next(req, res, 0, routerStack.length, routerStack, isUse ? nextUrl : contUrl)(nextError)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        i++;
                        return [3 /*break*/, 1];
                    case 15:
                        if (!res.headersSent) {
                            if (nextError)
                                throw nextError;
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ statusCode: 404, error: 'Not Found', message: 'Not Found' }));
                        }
                        return [3 /*break*/, 17];
                    case 16:
                        error_2 = _a.sent();
                        (0, errorHandler_1.ErrorHandler500)(res, error_2);
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
}
exports.default = Next;
