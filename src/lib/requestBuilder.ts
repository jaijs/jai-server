import Next from './next';
import AddRequestPrototype from './request/httpPrototype';
import AddResponsePrototype from './response/addResponseProto';
import { ErrorHandler500 } from './request/errorHandler';

import { JaiServerConfig, ExtendedServerResponse, Router, RequestHandlerExtended, RequestObject } from '../types/types';
function reqTimeout(req: any, res: any, timeout: number): void {
  let timeOutId: any = null;
  res.clearSetTimeout = () => {
    if (!timeout || !timeOutId) return req.destroy();
    clearTimeout(timeOutId)
  }
  if (!timeout) return
  timeOutId = setTimeout(() => {
    if (!res.headersSent) {
      res.writeHead(408, { 'Content-Type': 'text/plain' });
      res.end('Request Timeout');
      timeOutId = null;
    }
    req.destroy();
  }, timeout);


}

function RequestBuilder(config: JaiServerConfig, router: Router): RequestHandlerExtended {
  return async function RequestHandler(req: RequestObject, res: ExtendedServerResponse) {
    try {
      AddRequestPrototype(req, config);
      AddResponsePrototype(res);

      if (req.httpVersion === '2.0') {
        const { headers } = req;
        req.method = headers[':method'] as string;
        req.url = headers[':path'] as string;
        req.httpVersion = headers[':scheme'] === 'https' ? '2.0' : '1.1';
        (req as any).port = (req.socket as any).localPort;
      }

      res.setHeader('X-Powered-By', 'JAI-SERVER');
      reqTimeout(req, res, config.timeout || 0);
      await Next(req, res, 0,  router.stack.length + 1,  router.stack, '/')()

      res.clearSetTimeout();
    }
    catch (e) {
      ErrorHandler500(res, e)
      res.clearSetTimeout();

    }
  }
}


export default RequestBuilder;