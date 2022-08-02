const HTTP2_HEADER_STATUS = ':status';
const responsePrototype = {
  _JAI: { headersToSend: {} },
  sendFile(filePath) {
    function statCheck(stat, headers) {
      /* eslint-disable no-param-reassign */
      headers['last-modified'] = stat.mtime.toUTCString();
      /* eslint-disable no-param-reassign */
    }

    function onError(err) {
    // stream.respond() can throw if the stream has been destroyed by
    // the other side.
      try {
        if (err.code === 'ENOENT') {
          this.respond({ ':status': 404 });
        } else {
          this.respond({ ':status': 500 });
        }
        this.end();
      } catch (error) {
      // Perform actual error handling.
        this.respond({ ':status': 500 });
        this.end(`Error: ${error.message}`);
      }
    }

    this.respondWithFile(
      filePath,
      { 'content-type': 'text/plain; charset=utf-8' },
      { statCheck, onError },
    );
  },

  send(data) {
    let finalData = data;
    this.JAI.headersToSend[HTTP2_HEADER_STATUS] = 200;
    if (typeof data === 'object') {
      this.JAI.headersToSend['Content-Type'] = 'application/json';

      finalData = JSON.stringify(data);
    } else {
      this.JAI.headersToSend['Content-Type'] = 'text/html';
    }
    this.respond(finalData);
    this.end();
  },
  write(data) {
    this.end(data);
  },
  json(data) {
    this.JAI.headersToSend['Content-Type'] = 'application/json';
    this.JAI.headersToSend[HTTP2_HEADER_STATUS] = 200;
    this.end(JSON.stringify(data));
  },

  set(key, value) {
    this.JAI.headersToSend[key] = value;
  },

  get(key) { return this.JAI.headersToSend[key]; },

  status(statusCode) {
    this.JAI.headersToSend[HTTP2_HEADER_STATUS] = statusCode;
    return this;
  },
};

module.exports = responsePrototype;
