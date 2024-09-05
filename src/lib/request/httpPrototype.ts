import  { IncomingMessage }  from 'http';
import {RequestObject} from '../../types/types';
import { JaiServerConfig } from '../../types/types';

function AddRequestPrototype(req: IncomingMessage, config: JaiServerConfig): void {
  const extendedReq = req as RequestObject;
  extendedReq.body = {};
  const { host } = req.headers;
  const parsedUrl = new URL(`http://${host}${req.url}`);
  
  extendedReq.protocol = config.protocol;
  extendedReq.path = parsedUrl.pathname;
  extendedReq.host = config.host;
  extendedReq.port = config.port;
  extendedReq.query = Object.fromEntries(parsedUrl.searchParams);
  extendedReq.ip = (req.socket.remoteAddress as string);
}

export default  AddRequestPrototype;