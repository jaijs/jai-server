import { JaiServerConfig, JaiProto, Router } from './types/types';
declare function createProto(config: JaiServerConfig, routes: Router): JaiProto;
export default createProto;
