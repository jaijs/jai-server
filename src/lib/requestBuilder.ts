import Next from './next';
import AddRequestPrototype from './request/httpPrototype';
import AddResponsePrototype from './response/addResponseProto';
import {ErrorHandler500} from './request/errorHandler';

import { JaiServerConfig, ExtendedServerResponse, Router,RequestHandlerExtended, RequestObject } from '../types/types';
function RequestBuilder(config: JaiServerConfig,  router:Router ):RequestHandlerExtended {
  return function RequestHandler(req: RequestObject, res: ExtendedServerResponse) {


    AddRequestPrototype(req, config);
    if(!res.JAI)AddResponsePrototype(res);

    if (req.httpVersion === '2.0') {
      // Handle HTTP/2
      const { headers } = req;
      req.method = headers[':method'] as string;
      req.url = headers[':path'] as string;
      req.httpVersion = headers[':scheme'] === 'https' ? '2.0' : '1.1';
      (req as any).port = (req.socket as any).localPort;
    }

    res.setHeader('X-Powered-By', 'JAI-SERVER');
    Next(req, res, 0, router.stack.length, router.stack, '/')()?.catch((error:Error) => ErrorHandler500(res, error));
  } 
}

export default RequestBuilder;