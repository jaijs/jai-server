"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpPrototype_1 = __importDefault(require("./httpPrototype"));
function AddResponsePrototype(res) {
    const keys = Object.keys(httpPrototype_1.default);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (httpPrototype_1.default[key]) {
            res[key] = httpPrototype_1.default[key];
        }
    }
}
exports.default = AddResponsePrototype;
