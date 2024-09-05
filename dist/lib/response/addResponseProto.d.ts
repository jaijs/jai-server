import { ServerResponse } from 'http';
import { Http2ServerResponse } from 'http2';
declare function AddResponsePrototype(res: ServerResponse | Http2ServerResponse): void;
export default AddResponsePrototype;
