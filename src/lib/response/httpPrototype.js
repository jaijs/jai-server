const responsePrototype = {
  //   sendFile(filePath) {
  //     // res.sendFile(filePath);
  //   }

  send(data = '') {
    let finalData = data;
    if (typeof data === 'object') {
      this.writeHead(this.statusCode || 200, {
        'Content-Type':
        this.getHeader('Content-Type') || 'application/json',
      });
      finalData = JSON.stringify(data);
    } else {
      this.writeHead(this.statusCode || 200, {
        'Content-Type':
        this.getHeader('Content-Type') || 'text/html',
      });
    }
    this.write(finalData);
    this.end();
  },

  json(data = '') {
    this.writeHead(this.statusCode || 200, {
      'Content-Type':
      this.getHeader('Content-Type') || 'application/json',
    });
    this.write(typeof data === 'object' ? JSON.stringify(data) : '');
    this.end();
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
