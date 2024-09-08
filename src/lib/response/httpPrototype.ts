import { ExtendedServerResponse, sendFileOptions } from '../../types/types';
import * as path from 'path';
import { sendFile } from 'jai-static'

const responsePrototype: Partial<ExtendedServerResponse> = {
  send(data: any = '') {
    const self = this as unknown as ExtendedServerResponse;
    if (typeof data === 'object') {
      const jsonData = JSON.stringify(data);
      self.setHeader('Content-Type', 'application/json');
      self.setHeader('Content-Length', Buffer.byteLength(jsonData));
      self.writeHead(self.statusCode || 200);
      self.end(jsonData);
    } else {
      const strData = String(data);
      self.setHeader('Content-Type', 'text/html');
      self.setHeader('Content-Length', Buffer.byteLength(strData));
      self.writeHead(self.statusCode || 200);
      self.end(strData);
    }
  },
  json(data: any = '') {
    const self = this as unknown as ExtendedServerResponse;
    const jsonData = JSON.stringify(data);
    self.setHeader('Content-Type', 'application/json');
    self.setHeader('Content-Length', Buffer.byteLength(jsonData));
    self.writeHead(self.statusCode || 200);
    self.end(jsonData);
  },
  set: function(key: string, value: string) {
    (this as unknown as ExtendedServerResponse).setHeader(key, value);
  },
  redirect(link: string, statusCode: number = 302) {
    const self = this as unknown as ExtendedServerResponse;
    self.writeHead(statusCode, { Location: link });
    self.end();
  },
  get(key: string) {
    return (this as unknown as ExtendedServerResponse).getHeader(key) as string | undefined;
  },
  status(statusCode: number) {
    (this as unknown as ExtendedServerResponse).statusCode = statusCode;
    return this;
  },
  header(key: string, value: string) {
    (this as unknown as ExtendedServerResponse).setHeader(key, value);
    return this;
  },
  async sendFile(filePath: string, options: Partial<sendFileOptions> = {}, callback: Function) {
    if(!options) options = {};
    if(!Object.prototype.hasOwnProperty.call(options,'fallthrough'))  options.fallthrough=false;
    return await sendFile(path.resolve(filePath), options, this as unknown as ExtendedServerResponse, {}, callback);

  },
  JAI: true
};

export default responsePrototype;