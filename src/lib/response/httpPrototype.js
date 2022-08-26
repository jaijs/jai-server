const responsePrototype = {
  //   sendFile(filePath) {
  //     // res.sendFile(filePath);
  //   }

  send(data) {
    let finalData = data;
    if (typeof data === 'object') {
      this.writeHead(200, { 'Content-Type': 'application/json' });
      finalData = JSON.stringify(data);
    } else {
      this.writeHead(200, { 'Content-Type': 'text/html' });
    }
    this.write(finalData);
    this.end();
  },

  json(data) {
    this.writeHead(200, { 'Content-Type': 'application/json' });
    this.write(JSON.stringify(data));
  },

  set(key, value) {
    this.setHeader(key, value);
  },

  get(key) { return this.getHeader(key); },

  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
};

module.exports = responsePrototype;
