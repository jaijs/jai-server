import { RouteObject, HandlerFunction } from '../types/types';
declare function Next(req: any, res: any, i: number, mwLength: number, stack: RouteObject[], contUrl?: string): HandlerFunction;
export default Next;
