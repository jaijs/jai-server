"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HTTP2_HEADER_STATUS = ':status';
var responsePrototype = {
    JAI: { headersToSend: {} },
    sendFile: function (filePath) {
        var self = this;
        function statCheck(stat, headers) {
            headers['last-modified'] = stat.mtime.toUTCString();
        }
        function onError(err) {
            var _a, _b, _c;
            try {
                if (err.code === 'ENOENT') {
                    self.respond((_a = {}, _a[HTTP2_HEADER_STATUS] = 404, _a));
                }
                else {
                    self.respond((_b = {}, _b[HTTP2_HEADER_STATUS] = 500, _b));
                }
                self.end();
            }
            catch (error) {
                self.respond((_c = {}, _c[HTTP2_HEADER_STATUS] = 500, _c));
                self.end("Error: ".concat(error.message));
            }
        }
        self.respondWithFile(filePath, { 'content-type': 'text/plain; charset=utf-8' }, { statCheck: statCheck, onError: onError });
    },
    send: function (data) {
        if (data === void 0) { data = ''; }
        var self = this;
        if (!self.JAI)
            self.JAI = { headersToSend: {} };
        self.JAI.headersToSend[HTTP2_HEADER_STATUS] = self.JAI.headersToSend[HTTP2_HEADER_STATUS] || 200;
        if (typeof data === 'object') {
            self.JAI.headersToSend['Content-Type'] = self.JAI.headersToSend['Content-Type'] || 'application/json';
            data = JSON.stringify(data);
        }
        else {
            self.JAI.headersToSend['Content-Type'] = self.JAI.headersToSend['Content-Type'] || 'text/html';
        }
        self.respond(self.JAI.headersToSend);
        self.end("".concat(data));
    },
    write: function (chunk) {
        var self = this;
        if (!self.headersSent) {
            self.JAI.headersToSend[HTTP2_HEADER_STATUS] = self.JAI.headersToSend[HTTP2_HEADER_STATUS] || 200;
            self.respond(self.JAI.headersToSend);
        }
        return self.write(chunk);
    },
    json: function (data) {
        if (data === void 0) { data = ''; }
        var self = this;
        self.JAI.headersToSend['Content-Type'] = self.JAI.headersToSend['Content-Type'] || 'application/json';
        self.JAI.headersToSend[HTTP2_HEADER_STATUS] = self.JAI.headersToSend[HTTP2_HEADER_STATUS] || 200;
        self.respond(self.JAI.headersToSend);
        self.end(typeof data === 'object' ? JSON.stringify(data) : data);
    },
    set: function (key, value) {
        this.JAI.headersToSend[key] = value;
    },
    get: function (key) {
        return this.JAI.headersToSend[key];
    },
    status: function (statusCode) {
        this.JAI.headersToSend[HTTP2_HEADER_STATUS] = statusCode;
        return this;
    },
};
exports.default = responsePrototype;
