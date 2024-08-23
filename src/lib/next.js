const path = require('path');
const matcher = require('./matcher');
const RouteObjectMaker = require('./routeObjectMaker');
const errorHandler =  require('./request/errorHandler');
function Next(req, res, i, mwLength, stack, contUrl = '/') {

  return async function NextHandler() {
    try {
      for(;i <= mwLength - 1; i++) {
        const middleware = stack[i];
        const { url, isUse, method, handler } = middleware;
        const handlerType = typeof handler;

        let urlMatched = false;
        let params = [];
        let nextUrl = contUrl;

        if (url) {
          const urls = Array.isArray(url) ? url : [url];
          for(let i=0; i<urls.length; i++){
            const u = urls[i]
            nextUrl = u === null ? contUrl : path.join(contUrl, u);
            params = matcher(nextUrl, req.url.split('?')[0], !isUse && handlerType === 'function');
            if (params) {
              urlMatched = true;
              break;
            }
          }
        } else {
          urlMatched = true; // USE
        }

        const methodMatched = req.method === method || !method;

        if (urlMatched && methodMatched) {
          if (handlerType === 'function') {
            req.params = params;
            return await handler(req, res, Next(req, res, i + 1, mwLength, stack, contUrl));
          } else if (handlerType === 'object') {
            const routerStack = [...handler.stack, RouteObjectMaker(Next(req, res, i + 1, mwLength, stack, contUrl))];
            return await Next(req, res, 0, routerStack.length, routerStack, nextUrl)();
          }
        }

  
      }

      if (!res.headersSent) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ statusCode: 404, error: 'Not Found', message: 'Not Found' }));
      }
    } catch (error) {
      errorHandler(res,error)
    }
  };
}

module.exports = Next;