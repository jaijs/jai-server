import { ServerHttp2Stream } from 'http2';
interface ExtendedServerResponse extends ServerHttp2Stream {
    JAI: {
        headersToSend: Record<string, string | number>;
    };
    sendFile: (filePath: string) => void;
    send: (data?: string | object | number) => void;
    write: (data?: string | object | number) => boolean;
    json: (data?: object) => void;
    set: (key: string, value: string) => void;
    get: (key: string) => string | undefined;
    status: (statusCode: number) => ExtendedServerResponse;
}
declare const responsePrototype: Partial<ExtendedServerResponse>;
export default responsePrototype;
