

// Define a type for the handler function
export type HandlerFunction = (req?: any, res?: any, next?: Function) =>void| Promise<void>|any;
export type ErrorHandlerFunction = (error:any,req?: any, res?: any, next?: Function) =>void| Promise<void>;
import {ServerResponse } from 'http';


export type RouteObject = {
  url?: string | string[] | null
  method?: string | null;
  handler: HandlerFunction |ErrorHandlerFunction | { stack: RouteObject[] } ;
  isUse: boolean;
  isErrorHandler?: boolean;
}

export type RouteObjectMakerArgs = {
  callback: HandlerFunction | ErrorHandlerFunction|Router ;
  url?: string | null | string[]
  method: string | null
  isUse: boolean,
  isErrorHandler: boolean
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type Middleware = (req: any, res: any, next: any) => void;
export type Router = {
  stack: RouteObject[];
  addRoute(method: HttpMethod, url: string, ...middleware: Middleware[]): void;
  get(url: string, ...middleware: Middleware[]): void;
  post(url: string, ...middleware: Middleware[]): void;
  put(url: string, ...middleware: Middleware[]): void;
  delete(url: string, ...middleware: Middleware[]): void;
  options(url: string, ...middleware: Middleware[]): void;
  head(url: string, ...middleware: Middleware[]): void;
  use(urlOrMiddleware: string |string[] | Middleware | Router, ...middleware: Middleware[]|Router[]): void;

}

import { Http2SecureServer, Http2Server } from 'http2';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import {Server as NetServer} from 'net';


export type JaiServer = HttpServer& Http2Server & Http2SecureServer&NetServer | Http2Server | Http2SecureServer | HttpServer | HttpsServer;

export type JaiProto = Router & {
  listen(port: number, host?: string, ...args: any[]): JaiServer;
  close(callback: () => void): void;
  getConfig(): JaiServerConfig;
  server?: JaiServer;
  requestHandler?: (req: any, res: any) => void;
}



export type sendFileOptions={
  
  root: string;
  dotfiles: string;
  lastModified: true,
  etag: true,
  acceptRanges: true,
  cacheControl: true,
  fallthrough: boolean,

}



import { ServerResponse as HttpServerResponse } from 'http';
import { Http2ServerResponse } from 'http2';



export type JaiServerConfig ={
  http2?: boolean;
  https?: {
    key: string | Buffer;
    cert: string | Buffer;
  };
  allowHTTP1?: boolean;
  host?: string;
  [key: string]: any;
  Http1ServerResponse?: typeof HttpServerResponse;
  Http2ServerResponse?: typeof Http2ServerResponse;
  port?: number;
  static?: any;
  bodyParser?: any;
  httpVersion?: string;
  protocol?: string;
  timeout?: number;
}

export  type Params ={
  [key: string]: string | number | boolean | undefined;
}



import { IncomingMessage } from 'http';
export interface RequestObject extends IncomingMessage {
  params?: Params;
  body?: any;
  method?: string;
  url?: string;
  originalUrl?: string;
  protocol?: string;
  path?: string;
  host?: string;
  port?: number;
  query?: Record<string, string>;
  ip?: string;
  timeOutId?: NodeJS.Timeout|any;

}


export interface ExtendedServerResponse extends ServerResponse {
  send: (data?: any) => void;
  json: (data?: any) => void;
  set: (key: string, value: string) => void;
  redirect: (link: string, statusCode?: number) => void;
  get: (key: string) => string | undefined;
  status: (statusCode: number) => ExtendedServerResponse;
  header: (key: string, value: string) => ExtendedServerResponse;
  sendFile: (filePath: string, options: sendFileOptions, callback: Function) => void;
  JAI: true;
  clearSetTimeout: () => void;
}


export type RequestHandlerExtended =(req: any, res: any) => void;
/*



app.use(m1,m2,m3,m4)


*/