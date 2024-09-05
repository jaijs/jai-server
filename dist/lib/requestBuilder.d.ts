import { JaiServerConfig, RouteObject, RequestHandlerExtended } from '../types/types';
declare function RequestBuilder(config: JaiServerConfig, stack: RouteObject[]): RequestHandlerExtended;
export default RequestBuilder;
