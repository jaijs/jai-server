function RouteObjectMaker(callback, url = null, method = null, isUse = false) {
  return {
    url,
    method,
    handler: callback,
    isUse,


  };
}

module.exports = RouteObjectMaker;
