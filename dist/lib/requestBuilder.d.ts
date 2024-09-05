import { JaiServerConfig, Router, RequestHandlerExtended } from '../types/types';
declare function RequestBuilder(config: JaiServerConfig, router: Router): RequestHandlerExtended;
export default RequestBuilder;
