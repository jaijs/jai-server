"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTP2_HEADER_STATUS = ':status';
const responsePrototype = {
    JAI: { headersToSend: {} },
    sendFile(filePath) {
        const self = this;
        function statCheck(stat, headers) {
            headers['last-modified'] = stat.mtime.toUTCString();
        }
        function onError(err) {
            try {
                if (err.code === 'ENOENT') {
                    self.respond({ [HTTP2_HEADER_STATUS]: 404 });
                }
                else {
                    self.respond({ [HTTP2_HEADER_STATUS]: 500 });
                }
                self.end();
            }
            catch (error) {
                self.respond({ [HTTP2_HEADER_STATUS]: 500 });
                self.end(`Error: ${error.message}`);
            }
        }
        self.respondWithFile(filePath, { 'content-type': 'text/plain; charset=utf-8' }, { statCheck, onError });
    },
    send(data = '') {
        const self = this;
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
        self.end(`${data}`);
    },
    write(chunk) {
        const self = this;
        if (!self.headersSent) {
            self.JAI.headersToSend[HTTP2_HEADER_STATUS] = self.JAI.headersToSend[HTTP2_HEADER_STATUS] || 200;
            self.respond(self.JAI.headersToSend);
        }
        return self.write(chunk);
    },
    json(data = '') {
        const self = this;
        self.JAI.headersToSend['Content-Type'] = self.JAI.headersToSend['Content-Type'] || 'application/json';
        self.JAI.headersToSend[HTTP2_HEADER_STATUS] = self.JAI.headersToSend[HTTP2_HEADER_STATUS] || 200;
        self.respond(self.JAI.headersToSend);
        self.end(typeof data === 'object' ? JSON.stringify(data) : data);
    },
    set(key, value) {
        this.JAI.headersToSend[key] = value;
    },
    get(key) {
        return this.JAI.headersToSend[key];
    },
    status(statusCode) {
        this.JAI.headersToSend[HTTP2_HEADER_STATUS] = statusCode;
        return this;
    },
};
exports.default = responsePrototype;
