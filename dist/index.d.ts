import Router from './lib/router';
import { ConfigMain } from './types/types';
interface JaiServerInstance {
    use: (middleware: any) => void;
}
declare function JaiServer(config?: ConfigMain): JaiServerInstance;
declare const Jai_: typeof JaiServer & {
    Router: typeof Router;
};
export default Jai_;
