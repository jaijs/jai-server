"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const addResponseProto_1 = __importDefault(require("./addResponseProto"));
class JaiResponseHTTP extends http_1.ServerResponse {
    constructor(...args) {
        super(...args);
        (0, addResponseProto_1.default)(this);
    }
}
exports.default = JaiResponseHTTP;
