const RouteObjectMaker = require('jai-server/src/lib/routeObjectMaker');

function Router() {
  const routeObj= {
    stack: [],
    get(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 0; i < n; i += 1) {
       
        this.stack.push(RouteObjectMaker(middleware[i], url, 'get'));
      }
    },
    post(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 0; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'post'));
      }
    },
    put(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 0; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'put'));
      }
    },
    delete(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 0; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'delete'));
      }
    },
    options(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 0; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'options'));
      }
    },
    head(url, ...middleware) {
      const n = middleware.length;
      // for multiple middleware
      for (let i = 0; i < n; i += 1) {
        this.stack.push(RouteObjectMaker(middleware[i], url, 'head'));
      }
    },
    use(url, ...middleware) {     
       const n = middleware.length;
      if (typeof url === 'function') {
        // url is a middleware
        this.stack.push(RouteObjectMaker(url, null, null, true));
        for (let i = 0; i < n; i += 1) {
          this.stack.push(RouteObjectMaker(middleware[i], null, null, true));
        }
      } else if (typeof url === 'string') {
        // routed middleware or router object
        for (let i = 0; i < n; i += 1) {
          this.stack.push(RouteObjectMaker(middleware[i], url, null, true));
        }
      } else {
        // url is an object
        this.stack.push(RouteObjectMaker(url));
      }

      // for multiple middleware


    },
  };



  
  return  routeObj;
}

module.exports = Router;
