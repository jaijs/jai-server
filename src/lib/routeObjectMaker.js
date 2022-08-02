function RouteObjectMaker(callback, url = null, method = null) {
  return {
    url,
    method,
    handler: callback,

  };
}

module.exports = RouteObjectMaker;
