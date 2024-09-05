/// <reference types="node" />
import { Http2ServerResponse } from 'http2';
declare class JaiResponseHTTP2 extends Http2ServerResponse {
    constructor(...args: ConstructorParameters<typeof Http2ServerResponse>);
}
export default JaiResponseHTTP2;
