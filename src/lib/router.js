const RouteObjectMaker = require('./routeObjectMaker');

function Router() {
  return {
    stack: [],
    get(url, callback) {
      this.stack.push(RouteObjectMaker(callback, url, 'get'));
    },
    post(url, callback) {
      this.stack.push(RouteObjectMaker(callback, url, 'post'));
    },
    put(url, callback) {
      this.stack.push(RouteObjectMaker(callback, url, 'put'));
    },
    delete(url, callback) {
      this.stack.push(RouteObjectMaker(callback, url, 'delete'));
    },
    options(url, callback) {
      this.stack.push(RouteObjectMaker(callback, url, 'options'));
    },
    head(url, callback) {
      this.stack.push(RouteObjectMaker(callback, url, 'head'));
    },
    use(url, ...middleware) {
      if (typeof url === 'function') {
        // url is a middleware
        this.stack.push(RouteObjectMaker(url, null, null));
      } else if (typeof url === 'string') {
        // routed middleware or router object
        this.stack.push(RouteObjectMaker(middleware[0], url, null, null));
      } else {
        // url is an object
        this.stack.push(RouteObjectMaker(url));
      }
      const n = middleware.length;
      // for multiple middleware

      for (let i = 1; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url));
      }
    },
  };
}

module.exports = Router;
