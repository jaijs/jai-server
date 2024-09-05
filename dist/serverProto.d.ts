import { JaiServerConfig, JaiServer, JaiProto, RequestHandlerExtended } from './types/types';
declare function createProto(config: JaiServerConfig): {
    proto: JaiProto;
    requestHandler: RequestHandlerExtended;
    server: JaiServer;
};
export default createProto;
