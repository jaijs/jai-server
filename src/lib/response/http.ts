import  { ServerResponse } from 'http';
import AddResponsePrototype from './addResponseProto';

class JaiResponseHTTP extends ServerResponse {
  constructor(...args: ConstructorParameters<typeof ServerResponse>) {
    super(...args);
    AddResponsePrototype(this);
  }
}

export default JaiResponseHTTP;