import {ExtendedServerResponse,sendFileOptions} from '../../types/types';
import * as path from 'path';
import {sendFile} from 'jai-static'

const responsePrototype: Partial<ExtendedServerResponse> = {
  send(data: any = '') {
    const self = this as unknown as ExtendedServerResponse;
    let finalData = data;
    if (typeof data === 'object') {
      self.writeHead(self.statusCode || 200, {
        'Content-Type': self.getHeader('Content-Type') as string || 'application/json',
      });
      finalData = JSON.stringify(data);
    } else {
      self.writeHead(self.statusCode || 200, {
        'Content-Type': self.getHeader('Content-Type') as string || 'text/html',
      });
    }
    self.write(finalData + "");
    self.end();
  },

  json(data: any = '') {
    const self = this as unknown as ExtendedServerResponse;
    self.writeHead(self.statusCode || 200, {
      'Content-Type': self.getHeader('Content-Type') as string || 'application/json',
    });
    self.write(typeof data === 'object' ? JSON.stringify(data) : '');
    self.end();
  },

  set(key: string, value: string) {
    const self = this as unknown as ExtendedServerResponse;
    self.setHeader(key, value);
  },

  redirect(link: string, statusCode: number = 302) {
    const self = this as unknown as ExtendedServerResponse;
    self.writeHead(statusCode, {
      Location: link,
    });
    self.end();
  },

  get(key: string) {
    const self = this as unknown as ExtendedServerResponse;
    return self.getHeader(key) as string | undefined;
  },

  status(statusCode: number) {
    const self = this as unknown as ExtendedServerResponse;
    self.statusCode = statusCode;
    return self;
  },
  header(key: string, value: string) {
    const self = this as unknown as ExtendedServerResponse;
    self.setHeader(key, value);
    return self;
  },
  sendFile(filePath: string, options:Partial<sendFileOptions> ={}, callback:Function) {
    const absolutePath = path.resolve(filePath);
    if(!options){
      options = {}
    }
    if(!options.fallthrough) options.fallthrough=false
    return sendFile( absolutePath,  options, this, {},callback);
  },

  JAI:true
};

export default  responsePrototype;