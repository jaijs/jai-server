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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const jai_static_1 = require("jai-static");
const responsePrototype = {
    send(data = '') {
        const self = this;
        let finalData = data;
        if (typeof data === 'object') {
            self.writeHead(self.statusCode || 200, {
                'Content-Type': self.getHeader('Content-Type') || 'application/json',
            });
            finalData = JSON.stringify(data);
        }
        else {
            self.writeHead(self.statusCode || 200, {
                'Content-Type': self.getHeader('Content-Type') || 'text/html',
            });
        }
        self.write(finalData + "");
        self.end();
    },
    json(data = '') {
        const self = this;
        self.writeHead(self.statusCode || 200, {
            'Content-Type': self.getHeader('Content-Type') || 'application/json',
        });
        self.write(typeof data === 'object' ? JSON.stringify(data) : '');
        self.end();
    },
    set(key, value) {
        const self = this;
        self.setHeader(key, value);
    },
    redirect(link, statusCode = 302) {
        const self = this;
        self.writeHead(statusCode, {
            Location: link,
        });
        self.end();
    },
    get(key) {
        const self = this;
        return self.getHeader(key);
    },
    status(statusCode) {
        const self = this;
        self.statusCode = statusCode;
        return self;
    },
    header(key, value) {
        const self = this;
        self.setHeader(key, value);
        return self;
    },
    async sendFile(filePath, options, callback) {
        const absolutePath = path.resolve(filePath);
        (0, jai_static_1.sendFile)(absolutePath, options, this, callback, true);
    },
    JAI: true
};
exports.default = responsePrototype;
