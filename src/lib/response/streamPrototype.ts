import { ServerHttp2Stream } from 'http2';
import { Stats } from 'fs';

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

const HTTP2_HEADER_STATUS = ':status';

const responsePrototype: Partial<ExtendedServerResponse> = {
  JAI: { headersToSend: {} },
  sendFile(filePath: string) {
    const self = this as ExtendedServerResponse & { respondWithFile: any };
    function statCheck(stat: Stats, headers: Record<string, string>) {
      headers['last-modified'] = stat.mtime.toUTCString();
    }
    function onError(err: NodeJS.ErrnoException) {
      try {
        if (err.code === 'ENOENT') {
          self.respond({ [HTTP2_HEADER_STATUS]: 404 });
        } else {
          self.respond({ [HTTP2_HEADER_STATUS]: 500 });
        }
        self.end();
      } catch (error) {
        self.respond({ [HTTP2_HEADER_STATUS]: 500 });
        self.end(`Error: ${(error as Error).message}`);
      }
    }
    self.respondWithFile(
      filePath,
      { 'content-type': 'text/plain; charset=utf-8' },
      { statCheck, onError }
    );
  },
  send(data: any = '') {
    const self = this as ExtendedServerResponse & { respond: any };
    if (!self.JAI) self.JAI = { headersToSend: {} };
    self.JAI.headersToSend[HTTP2_HEADER_STATUS] = self.JAI.headersToSend[HTTP2_HEADER_STATUS] || 200;
    if (typeof data === 'object') {
      self.JAI.headersToSend['Content-Type'] = self.JAI.headersToSend['Content-Type'] || 'application/json';
      data = JSON.stringify(data);
    } else {
      self.JAI.headersToSend['Content-Type'] = self.JAI.headersToSend['Content-Type'] || 'text/html';
    }
    self.respond(self.JAI.headersToSend);
    self.end(`${data}`);
  },
  write(chunk: any): boolean {
    const self = this as ExtendedServerResponse;
    if (!self.headersSent) {
      self.JAI.headersToSend[HTTP2_HEADER_STATUS] = self.JAI.headersToSend[HTTP2_HEADER_STATUS] || 200;
      self.respond(self.JAI.headersToSend);
    }
    return self.write(chunk);
  },
  json(data: any = '') {
    const self = this as ExtendedServerResponse & { respond: any };
    self.JAI.headersToSend['Content-Type'] = self.JAI.headersToSend['Content-Type'] || 'application/json';
    self.JAI.headersToSend[HTTP2_HEADER_STATUS] = self.JAI.headersToSend[HTTP2_HEADER_STATUS] || 200;
    self.respond(self.JAI.headersToSend);
    self.end(typeof data === 'object' ? JSON.stringify(data) : data);
  },
  set(key: string, value: string) {
    (this as ExtendedServerResponse).JAI.headersToSend[key] = value;
  },
  get(key: string) {
    return (this as ExtendedServerResponse).JAI.headersToSend[key] as string | undefined;
  },
  status(statusCode: number) {
    (this as ExtendedServerResponse).JAI.headersToSend[HTTP2_HEADER_STATUS] = statusCode;
    return this as ExtendedServerResponse;
  },
};

export default responsePrototype;