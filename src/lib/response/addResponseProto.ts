import { ServerResponse } from 'http';
import proto from './httpPrototype';
import {Http2ServerResponse} from 'http2';

function AddResponsePrototype(res: ServerResponse|Http2ServerResponse): void {
  const keys = Object.keys(proto);
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof typeof proto;
    if (proto[key]) {
      (res as any)[key] = proto[key];
    }
  }
}

export default  AddResponsePrototype;