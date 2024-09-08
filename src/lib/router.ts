import { HttpMethod, Middleware,Router as RouterType,ErrorHandlerFunction} from '../types/types';
import RouteObjectMaker from './routeObjectMaker';
class TypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TypeError';
  }
}
const error = (e:string)=>new TypeError(e);
// type callbacks={
//   stack:RouteObject[]
// }
function Router() {
  const routeObj:RouterType = {
    stack: [],
    addRoute(method: HttpMethod, url: string|string[], ...middleware: Middleware[]): void {
      if(!url || (typeof url !== 'string' && !Array.isArray(url))) {
        throw  error(`app.${method.toLowerCase()}() requires a URL string received: ${url} Typeof ${typeof url}`);
      }
      if(middleware.length === 0) {
      throw error(`app.${method.toLowerCase()}() requires middleware function received: nothing`);
      }
     // const callbacks:callbacks={stack:[]};
      middleware.forEach((mw) => {
        if(typeof mw !== 'function') {
          throw new TypeError(`app.${method}() requires middleware function received: ${typeof mw}`);
        }
        const isErrorHandler = typeof mw === 'function' && mw.length === 4;
        this.stack.push(RouteObjectMaker({callback:mw, url, method, isUse:false,isErrorHandler}));
      });
     // this.stack.push(RouteObjectMaker({callback:callbacks, url, method, isUse:false,isErrorHandler:false}));
    },
    get(url: string, ...middleware: Middleware[]): void {
      this.addRoute('GET', url, ...middleware);
    },

    post(url: string, ...middleware: Middleware[]): void {
      this.addRoute('POST', url, ...middleware);
    },

    put(url: string, ...middleware: Middleware[]): void {
      this.addRoute('PUT', url, ...middleware);
    },

    delete(url: string, ...middleware: Middleware[]): void {
      this.addRoute('DELETE', url, ...middleware);
    },

    options(url: string, ...middleware: Middleware[]): void {
      this.addRoute('OPTIONS', url, ...middleware);
    },

    head(url: string, ...middleware: Middleware[]): void {
      this.addRoute('HEAD', url, ...middleware);
    },

    use(urlOrMiddleware: string | string[] | RouterType |ErrorHandlerFunction | Middleware, ...middleware: Middleware[]|RouterType[]): void {
      const isUse = true;
      const method = null;
      let isErrorHandler = false;
      let callback:Middleware|RouterType ;
      let url:null | string |string[]= null;
      const error = (mw:string)=>new TypeError(`app.use() requires middleware function/s or router/s received:${mw} `);

      if(typeof urlOrMiddleware!=='string'  && !Array.isArray(urlOrMiddleware) && !urlOrMiddleware) {
        throw error(`${urlOrMiddleware} Typeof ${typeof urlOrMiddleware}`);
      }

      if (typeof urlOrMiddleware === 'string' || Array.isArray(urlOrMiddleware)) { // with URL
        if(!middleware || middleware.length === 0) {
          throw error(`${middleware} Typeof  ${middleware.length==0?' empty array':typeof middleware}`);
        }
        middleware.forEach((mw) => {
          url = urlOrMiddleware;
          callback = mw;
          
          if(typeof callback!== 'function' && !((mw as RouterType).stack)) {
            throw error( typeof callback);
          }
          isErrorHandler = typeof callback === 'function' && callback.length === 4;
          this.stack.push(RouteObjectMaker({callback, url, method, isUse,isErrorHandler}));
        });
      }
      else if(typeof urlOrMiddleware == 'function' || (urlOrMiddleware as RouterType).stack) { // Router
      
        // First middleware is the callback
        callback = urlOrMiddleware;
        isErrorHandler = typeof callback === 'function' && callback.length === 4;
        this.stack.push(RouteObjectMaker({callback, url, method, isUse,isErrorHandler}));

        // Rest of the middleware are added as middleware GLOBAL/ Without URL
        middleware.forEach((mw) => {
          callback = mw;
          if(typeof callback!== 'function' && !((mw as RouterType).stack)) {
            throw error(typeof callback);
          }
          isErrorHandler = typeof callback === 'function' && callback.length === 4;
          this.stack.push(RouteObjectMaker({callback, url, method, isUse,isErrorHandler}));
        });
      }  else {  // Error
        throw error(typeof urlOrMiddleware);
         
      }
    }
  }
  return routeObj;
}
export default Router;