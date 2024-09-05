/// <reference types="node" />
import { IncomingMessage } from 'http';
import { JaiServerConfig } from '../../types/types';
declare function AddRequestPrototype(req: IncomingMessage, config: JaiServerConfig): void;
export default AddRequestPrototype;
