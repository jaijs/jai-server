import { ServerResponse } from 'http';
import proto from './httpPrototype';
import {Http2ServerResponse} from 'http2';

function AddResponsePrototype(res: ServerResponse|Http2ServerResponse): void {
  for (const key in proto) {
   (res as any)[key] = proto[key as keyof typeof proto];
  }
}

export default  AddResponsePrototype;