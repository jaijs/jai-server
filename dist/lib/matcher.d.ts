import { Params } from '../types/types';
declare function Matcher(q: string | undefined, url: string | undefined, fullMatch?: boolean, strict?: boolean): Params | boolean;
export default Matcher;
