import * as path from 'path';
import matcher from './matcher';
import RouteObjectMaker from './routeObjectMaker';
import { ErrorHandler500 } from './request/errorHandler';
import { RouteObject, Params, HandlerFunction, ErrorHandlerFunction } from '../types/types';
// Type guards (unchanged)
function isHandlerFunction(handler: unknown): handler is HandlerFunction | ErrorHandlerFunction {
  return typeof handler === 'function';
}
function isHandlerObject(handler: any): handler is { stack: RouteObject[] } {
  return typeof handler === 'object' && Array.isArray(handler.stack);
}
const Error404 = JSON.stringify({ statusCode: 404, error: 'Not Found', message: 'Not Found' })
function Next(req: any, res: any, i: number, mwLength: number, stack: RouteObject[], contUrl = '/'): HandlerFunction {
  return async function NextHandler(nextError: any) {
    try {
      while (i < mwLength) {

        const middleware = stack[i];
        if (!middleware) {
          i++;
          continue;
        }
        const { url, isUse, method, handler, isErrorHandler } = middleware;
        let urlMatched = !url;
        let params: Params | boolean = {};
        let nextUrl = contUrl;
        if (url) {
          const urls = Array.isArray(url) ? url : [url];
          for (const u of urls) {
            if (u == null) {
              urlMatched = true;
              break;
            }
            nextUrl = path.join(contUrl, u);
            params = matcher(nextUrl, req.url.split('?')[0], !isUse && isHandlerFunction(handler));
            if (params) {
              urlMatched = true;
              break;
            }
          }
        }
        const methodMatched = !method || req.method === method;
        if (!urlMatched || !methodMatched) {
          i++;
          continue;
        }
        if (isHandlerFunction(handler)) {
          req.params = params;
          const nextFunction = Next(req, res, i + 1, mwLength, stack, contUrl);
          if (!nextError && isErrorHandler) {
            return await nextFunction(nextError);
          }
          try {
            if (nextError && !isErrorHandler) return await nextFunction(nextError);
            // Prepare args based on whether it's an error handler or not
            const args = nextError && isErrorHandler
              ? [nextError, req, res, nextFunction]
              : [req, res, nextFunction];
            // Use type assertion to resolve the spread operator issue
            return await (handler as Function)(...args);
          } catch (error: any) {
            return await nextFunction(error);
          }
        } else if (isHandlerObject(handler)) {
          const newStack = handler.stack.concat([RouteObjectMaker({
            callback: async (err: any, req: any, res: any) =>
              await Next(req, res, i + 1, mwLength, stack, contUrl)(err || nextError),
            url: null, method: null, isUse: true, isErrorHandler: true
          }),
          RouteObjectMaker({
            callback: async (req: any, res: any) =>
              await Next(req, res, i + 1, mwLength, stack, contUrl)(nextError),
            url: null, method: null, isUse: true, isErrorHandler: false
          })
          ]);
          return await Next(req, res, 0, newStack.length, newStack, isUse ? nextUrl : contUrl)(nextError);
        }
        i++;
      } // loop end
      if (nextError) throw nextError;
      if (!res.headersSent) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(Error404);
      }
    } catch (error: any) {
      ErrorHandler500(res, error);
    }
  };
}
export default Next;