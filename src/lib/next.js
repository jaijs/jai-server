const path = require('path');
const matcher = require('./matcher');
const RouteObjectMaker = require('./routeObjectMaker');

function Next(req, res, i, mwLength, stack, contUrl = '/') {
  return async function NextHandler() {
    try {
      if (i <= mwLength - 1) {
        const prevUrl = contUrl;
        const middleware = stack[i];

        const { url } = middleware;

        const nextUrl = path.join(prevUrl, (url === null ? '' : url));
        const handlerType = typeof middleware.handler;
        let params = [];
        const urlMatched = url === null ? true : params = matcher(nextUrl, req.url.split('?')[0], handlerType === 'function');
        const methodMatched = middleware.method === null ? true
          : req.method.toLowerCase() === middleware.method.toLowerCase();

        if (handlerType === 'function' && urlMatched && methodMatched) {
          // normal middleware
          req.params = params;
          return await middleware.handler(req, res, Next(req, res, i + 1, mwLength, stack));
        } if (handlerType === 'object' && urlMatched && methodMatched) {
          // routed middleware
          const routerLn = middleware.handler.stack.length;

          return await Next(req, res, 0, routerLn + 1, [...middleware.handler.stack,
            // Preview Next middleware
            RouteObjectMaker(Next(req, res, i + 1, mwLength, stack, prevUrl))], nextUrl)();
        }
        // Incase  the routed middleware is not Matched
        return await Next(req, res, i + 1, mwLength, stack, prevUrl)();
      } // end of the iteration
      // last default middleware
      if (!res.headersSent) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ statusCode: 404, error: 'Not Found', message: 'Not Found' }));
      }
      return res.end();
    } catch (error) {
      console.log(error);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ statusCode: 500, error: 'Internal Server Error - Jai Server', message: error.stack }));
        res.end();
      }
    }
  };
}
module.exports = Next;
