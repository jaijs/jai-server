import { ServerHttp2Stream } from 'http2';
interface ExtendedServerResponse extends ServerHttp2Stream {
    JAI: {
        headersToSend: Record<string, string | number>;
    };
    sendFile: (filePath: string) => void;
    send: (data?: any) => void;
    write: (data?: any) => boolean;
    json: (data?: any) => void;
    set: (key: string, value: string) => void;
    get: (key: string) => string | undefined;
    status: (statusCode: number) => ExtendedServerResponse;
}
declare const responsePrototype: Partial<ExtendedServerResponse>;
export default responsePrototype;
