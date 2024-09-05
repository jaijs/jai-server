import { ServerResponse } from 'http';
declare class JaiResponseHTTP extends ServerResponse {
    constructor(...args: ConstructorParameters<typeof ServerResponse>);
}
export default JaiResponseHTTP;
