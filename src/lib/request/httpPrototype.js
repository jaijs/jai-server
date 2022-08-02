function AddRequestPrototype(req, config) {
  const { host } = req.headers;
  const parsedUrl = new URL(`http://${host}${req.url}`);
  req.protocol = config.protocol;
  req.path = parsedUrl.pathname;
  req.host = config.host;
  req.port = config.port;
  req.query = [...(parsedUrl.searchParams)].reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
}

module.exports = AddRequestPrototype;
