# Jai Server: Ultra-Fast
![Jai-Server logo](./jai-server.png)
Fast, Powerfull, Robust web framework for creating API in Node.js

---

[![Twitter Follow](https://img.shields.io/twitter/follow/hsk11dev?label=Follow)](https://twitter.com/intent/follow?screen_name=hsk11dev)
[![Linkedin: Harpal Singh](https://img.shields.io/badge/-hsk11-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/hsk11)](https://www.linkedin.com/in/hsk11/)
[![GitHub followers](https://img.shields.io/github/followers/hsk11?label=Follow&style=social)](https://github.com/hsk11)
[![npm version](https://badge.fury.io/js/jai-server.svg)](https://www.npmjs.com/package/jai-server)

---

## About

Jai Server is an ultra-high-performance, easy-to-use web framework for Node.js, engineered for building lightning-fast and highly scalable web applications and APIs.



With its innovative lightweight architecture and powerful features, Jai Server dramatically outperforms popular frameworks like Express.js while maintaining simplicity, flexibility, and developer-friendly ergonomics.

## 🚀 Quick Start

```bash
npm install jai-server
```

```javascript
const JaiServer = require('jai-server');

const app = JaiServer();

app.get('/', (req, res) => {
  res.send('Hello, Jai Server!');
});

app.listen({ port: 3000 }, () => {
  console.log('Jai Server is running on http://localhost:3000');
});
```

## 🌟 Features

- ✅ **Ready to use**: Minimal setup required for rapid development #easy-setup
- 🔄 **RESTful API support**: Create robust APIs with ease #rest-api
- ⚙️ **Flexible configuration**: Easily adapt to your project needs #customizable
- 📁 **Static file serving**: Effortlessly serve static content #static-files
- 🛣️ **Advanced routing**: Powerful and intuitive routing system #routing
- 🔀 **Middleware support**: Fine-grained control over request/response flow #middleware
- 🌐 **Comprehensive HTTP method support**: GET, POST, PUT, PATCH, OPTIONS, HEAD, DELETE #http-methods
- 🔒 **Built-in security features**: Enhance your application's security out of the box #security
- 🚀 **Exceptional performance**: Blazing fast, outperforming other popular frameworks #high-performance
- ⚡ **Low overhead**: Minimal impact on system resources for efficient scaling #efficient
- 🔧 **HTTP/2 support**: Leverage modern web technologies for improved speed #http2
- 🔌 **Extensible plugin ecosystem**: Extend functionality with a growing library of plugins #extensible

## 📊 Performance Benchmark

Jai Server significantly outperforms Express.js in rigorous benchmark tests:

### Jai Server Performance

```
┌─────────┬───────┬───────┬───────┬───────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev    │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼──────────┼────────┤
│ Latency │ 14 ms │ 17 ms │ 39 ms │ 52 ms │ 22.46 ms │ 15.01 ms │ 566 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴──────────┴────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬──────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev    │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼──────────┼─────────┤
│ Req/Sec   │ 34,015  │ 34,015  │ 45,759  │ 46,719  │ 43,497.6 │ 4,771.65 │ 34,011  │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼──────────┼─────────┤
│ Bytes/Sec │ 6.74 MB │ 6.74 MB │ 9.06 MB │ 9.25 MB │ 8.61 MB  │ 943 kB   │ 6.73 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴──────────┴─────────┘

219k requests in 5.03s, 43.1 MB read
```

### Express.js Performance

```
┌─────────┬───────┬───────┬────────┬────────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5%  │ 99%    │ Avg      │ Stdev    │ Max    │
├─────────┼───────┼───────┼────────┼────────┼──────────┼──────────┼────────┤
│ Latency │ 68 ms │ 71 ms │ 116 ms │ 126 ms │ 74.66 ms │ 11.31 ms │ 154 ms │
└─────────┴───────┴───────┴────────┴────────┴──────────┴──────────┴────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬──────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev    │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼──────────┼─────────┤
│ Req/Sec   │ 10,775  │ 10,775  │ 13,855  │ 13,991  │ 13,221.6 │ 1,231.34 │ 10,773  │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼──────────┼─────────┤
│ Bytes/Sec │ 2.65 MB │ 2.65 MB │ 3.41 MB │ 3.44 MB │ 3.25 MB  │ 303 kB   │ 2.65 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴──────────┴─────────┘

67k requests in 5.02s, 16.3 MB read
```

### Key Performance Insights

- **3x Faster**: Jai Server handles an impressive ~40,304 req/sec compared to Express.js's ~13,221 req/sec
- **67% Lower Latency**: 24.32ms average for Jai Server vs 74.66ms for Express.js
- **2.6x Higher Throughput**: 8.5 MB/sec for Jai Server vs 3.25 MB/sec for Express.js
- **Consistent Performance**: Jai Server shows remarkably low standard deviation in requests per second, indicating stable and reliable performance under high load
- **Efficient Resource Utilization**: Jai Server processes 3 times more requests while maintaining lower and more consistent latency

Jai Server delivers exceptional, consistent, and scalable performance, making it the ideal choice for high-load applications, microservices, real-time systems, and performance-critical projects. #performance-comparison #high-throughput #low-latency

## 📚 Table of Contents

- [Installation](#-installation)
- [Usage Examples](#-usage-examples)
- [API Reference](#-api-reference)
- [Advanced Features](#-advanced-features)
- [Contributing](#-contributing)
- [License](#-license)

## 📥 Installation

Get started with Jai Server in your project:

```bash
npm install jai-server
```

## 🎯 Usage Examples

### Basic Server

```javascript
const JaiServer = require('jai-server');

const app = JaiServer();

app.get('/', (req, res) => {
  res.send('Welcome to Jai Server!');
});

app.listen({ port: 3000 }, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Serve Static Files

```javascript
const JaiServer = require('jai-server');

const app = JaiServer({
  static: {
    dir: `${__dirname}/public`,
    basePath: '/static',
  },
});

app.listen({ port: 3000 }, () => {
  console.log('Static files served at http://localhost:3000/static');
});
```

### HTTPS and HTTP/2 Support

```javascript
const fs = require('fs');
const JaiServer = require('jai-server');

const app = JaiServer({
  http2: true,
  allowHTTP1: true,
  https: {
    key: fs.readFileSync('path/to/key.pem'),
    cert: fs.readFileSync('path/to/cert.pem'),
  },
});

app.get('/', (req, res) => {
  res.send('Secure Jai Server!');
});

app.listen({ port: 443 }, () => {
  console.log('Secure server running on https://localhost');
});
```

### RESTful API with Route Parameters

```javascript
const JaiServer = require('jai-server');

const app = JaiServer();

app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id, message: 'User details' });
});

app.listen({ port: 3000 });
```

### Using Middleware and Routers

```javascript
const JaiServer = require('jai-server');

const app = JaiServer();
const router = JaiServer.Router();

// Middleware
app.use((req, res, next) => {
  console.log(`Request received at ${new Date()}`);
  next();
});

// Router
router.get('/hello', (req, res) => {
  res.send('Hello from the router!');
});

app.use('/api', router);

app.listen({ port: 3000 });
```


## Built-in Response Methods

### res.send(data)

Sends a response in HTML, text, or any other format. Automatically sets the appropriate Content-Type header.

```javascript
app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});
```

### res.json(data)

Sends a JSON response with Content-Type: application/json.

```javascript
app.get('/user', (req, res) => {
  res.json({ id: 1, name: 'John Doe' });
});
```

### res.redirect(link, [statusCode])

Redirects the client to the given URL. The default status code is 302.

```javascript
app.get('/old-route', (req, res) => {
  res.redirect('/new-route');
});
```

### res.status(statusCode)

Sets the HTTP status code for the response. Chainable with other response methods.

```javascript
app.get('/error', (req, res) => {
  res.status(404).send('Page Not Found');
});
```

### res.header(key, value)

Sets custom headers for the response.

```javascript
app.get('/custom-header', (req, res) => {
  res.header('X-Custom-Header', 'MyValue').send('Header set!');
});
```

### res.sendFile(filePath, [options], [callback])

Serves a file to the client. Options can include root directory, cache settings, etc.

```javascript
app.get('/download', (req, res) => {
  res.sendFile('path/to/file.txt',{
    fallthrough:false // Optional: default false
  },(err)=>{ // Optional Call Back/Next

  });
});
```

## Middleware and Routers

Jai Server supports middleware and routers for more complex applications:

```javascript
const JaiServer = require('jai-server');
const app = JaiServer();
const router = JaiServer.Router();

// Middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// Router
router.get('/hello', (req, res) => {
  res.send('Hello from the router!');
});

app.use('/api', router);

app.listen({ port: 3000 });
```


## 📘 API Reference

### JaiServer(options)

Creates a new Jai Server instance.

#### Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `host` | `string` | Host name | `'localhost'` |
| `port` | `number` | Port number | `3000` |
| `static` | `object` | Static file serving options (jai-static) | `null` |
| `https` | `object` | HTTPS options | `null` |
| `http2` | `boolean` | Enable HTTP/2 | `false` |
| `allowHTTP1` | `boolean` | Allow HTTP/1 on HTTP/2 server | `true` |
| `allowHTTP1` | `boolean` | Allow HTTP/1 on HTTP/2 server | `true` |
| `timeout` | `number` | Timeout req after ms, default 60000(1min) | `60000` |


### app.METHOD(path, handler)

Routes an HTTP request, where METHOD is the HTTP method in lowercase.

```javascript
app.get('/path', (req, res) => { /* ... */ });
app.post('/path', (req, res) => { /* ... */ });
// Other HTTP methods: put, patch, delete, options, head
```

### app.use([path,] function [, function...])

Mounts middleware function(s) at the specified path.

### app.listen(options[, callback])

Starts the server.

## 🚀 Advanced Features

- **Middleware Chaining**: Create complex request processing pipelines
- **Custom Error Handling**: Implement application-specific error management
- **Request Body Parsing**: Built-in support for JSON and URL-encoded bodies
- **Modular Routing**: Organize routes using the Router class
- **WebSocket Support**: Real-time, bidirectional communication
- **Database Integration**: Easy connection with popular databases
- **Authentication Middleware**: Secure your routes and APIs
- **Rate Limiting**: Protect your server from abuse
- **CORS Support**: Configure Cross-Origin Resource Sharing
- **Compression**: Optimize response size for faster transmission



## 📄 License

Jai Server is open-source software licensed under the [MIT license](LICENSE).

---


## Author

Harpal Singh: [@hsk11](https://github.com/hsk11) . **Website**: [Jaijs.org](https://jaijs.org/).

Built with ❤️ by [Harpal Singh](https://github.com/hsk11)

#jai-server #node-js-framework #web-development #backend #api-development #performance-optimization #microservices #realtime-applications #node-js #web-framework #high-performance #rest-api #http2 #express-alternative #api #web-api #restapi #http-server #nodejs-api
Enhanced Response Methods #jaijs



