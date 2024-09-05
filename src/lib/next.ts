import * as path from 'path';
import matcher from './matcher';
import RouteObjectMaker from './routeObjectMaker';
import { ErrorHandler500 } from './request/errorHandler';
import { RouteObject, Params, HandlerFunction, ErrorHandlerFunction } from '../types/types';



// Type guard to check if handler is a function
function isHandlerFunction(handler: unknown): handler is HandlerFunction | ErrorHandlerFunction {
  return typeof handler === 'function';
}

// Type guard to check if handler is an object with a stack property
function isHandlerObject(handler: any): handler is { stack: RouteObject[] } {
  return typeof handler === 'object' && Array.isArray(handler.stack);
}

function Next(req: any, res: any, i: number, mwLength: number, stack: RouteObject[], contUrl = '/'): HandlerFunction {
  return async function NextHandler(nextError: any) {
    try {
      for (; i <= mwLength - 1; i++) {
        const middleware = stack[i];
        if (!middleware) continue;
        const { url, isUse, method, handler, isErrorHandler } = middleware;
        let urlMatched;
        let params: Params | boolean = {};
        let nextUrl = contUrl;
        // nextError && console.log(1, { nextError, url, method, nextUrl, contUrl, isUse, isErrorHandler });
        if (url) {
          const urls = Array.isArray(url) ? url : [url];
          for (let j = 0; j < urls.length; j++) {
            const u = urls[j];
            if (u == null) { urlMatched = true; break; }
            nextUrl = path.join(contUrl, u);
            params = matcher(nextUrl, req.url.split('?')[0], !isUse && isHandlerFunction(handler));
            if (params) {
              urlMatched = true;
              break;
            }
          }

        } else urlMatched = true; // USE


        const methodMatched = req.method === method || !method;
        // console.log(2,{urlMatched, methodMatched, method, url,contUrl, handler, isUse, isErrorHandler, nextError});
        if (!urlMatched || !methodMatched) return await Next(req, res, i + 1, mwLength, stack, contUrl)(nextError);


        if (isHandlerFunction(handler)) {
          req.params = params;
          const nextFunction = Next(req, res, i + 1, mwLength, stack, contUrl);
          if (!nextError && isErrorHandler) { // NO ERROR
            return await nextFunction(nextError) // Bypass the current error handler
          }
          else {
            try {

              if (nextError && !isErrorHandler) return await nextFunction(nextError); // MOVE TO NEXT MIDDLEWARE
              const args: Parameters<HandlerFunction> | Parameters<ErrorHandlerFunction> = [];
              if (nextError && isErrorHandler) args.push(nextError); // ERROR HANDLER
              args.push(req, res, nextFunction);
              return await handler(...args); // Normal flow
            }
            catch (error: any) {
              return await nextFunction(error);
            }

          }


        } else if (isHandlerObject(handler)) {
          // console.log('isHandlerObject', nextError);
          const routerStack = [
            ...handler.stack,
            RouteObjectMaker({
              callback: async (err: any, req: any, res: any) => {
                //console.log(101, err)
                await Next(req, res, i + 1, mwLength, stack, contUrl)(err || nextError) // Attach the previus error 
              },
              url: null, method: null, isUse: true, isErrorHandler: true
            }),
            RouteObjectMaker({
              callback: async (req: any, res: any) => {
                //console.log(2, "No error")
                await Next(req, res, i + 1, mwLength, stack, contUrl)(nextError) // Normal flow without Error
              },
              url: null, method: null, isUse: true, isErrorHandler: false
            }),
          ];

          await Next(req, res, 0, routerStack.length, routerStack, isUse ? nextUrl : contUrl)(nextError);

        }


        // In case the routed middleware is not Matched

      }
      if (nextError) throw nextError;
      if (!res.headersSent) {
      
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ statusCode: 404, error: 'Not Found', message: 'Not Found' }));
      }
    } catch (error: any) {
      ErrorHandler500(res, error);
    }
  };
}

export default Next;