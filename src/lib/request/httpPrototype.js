function AddRequestPrototype(req, config) {
  const { host } = req.headers;
  const parsedUrl = new URL(`http://${host}${req.url}`);
  req.protocol = config.protocol;
  req.path = parsedUrl.pathname;
  req.host = config.host;
  req.port = config.port;
  req.query = {};
  const entries = Array.from(parsedUrl.searchParams);
  
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    req.query[key] = value;
  }

  req.ip = req.socket.remoteAddress;
  req.port = req.socket.address().port;
}

module.exports = AddRequestPrototype;
