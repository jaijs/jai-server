const RouteObjectMaker = require('./routeObjectMaker');

function Router() {
  return {
    stack: [],
    get(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 1; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'get'));
      }
    },
    post(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 1; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'post'));
      }
    },
    put(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 1; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'put'));
      }
    },
    delete(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 1; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'delete'));
      }
    },
    options(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 1; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'options'));
      }
    },
    head(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 1; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'head'));
      }
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
