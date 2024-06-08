# Jai Server
Fast, simple, secure, powerful web Framework for node.

---

[![Twitter Follow](https://img.shields.io/twitter/follow/hsk11dev?label=Follow)](https://twitter.com/intent/follow?screen_name=hsk11dev)
[![Linkedin: Harpal Singh](https://img.shields.io/badge/-harpalsingh11-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/hsk11)](https://www.linkedin.com/in/hsk11/)

[![GitHub followers](https://img.shields.io/github/followers/hsk11?label=Follow&style=social)](https://github.com/hsk11)
---



## Features

- Ready to use
- Create REST APIs
- Easy to configure
- Server Static Files
- Create Multiple Routes
- Control API flow
- Supported Http Methods : GET, POST, PUT, PATCH, OPTIONS, HEAD, DELETE





## Installation

Install my-project with npm

```bash
  npm install jai-server
```

### Usage / Examples

#### Hello World
```javascript
const JaiServer = require('jai-server');

const app = JaiServer(/* options */);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen({ port: 3000 }, (...args) => {
  console.log('Server is running on port http://localhost:3000', args);
});

```

#### Serve Static Files
```javascript
const JaiServer = require('jai-server');

const App = JaiServer(
  {
    static: {
      dir: `${__dirname}/public`, // public folder,
      basePath: '/static', // Optional
    },

  },
);

App.listen({ port: 3000 }, (...args) => {
  console.log('Server is running on port http://localhost:3000', args);
});


```

#### Jai Server Http2 / Https
```javascript

const JaiServer = require('jai-server');

const app = JaiServer({
    http2: true,
    allowHTTP1: true, // allow Http1.0 request
    https: // enables Https
      {
        key: fs.readFileSync('_location_for_key_'),
        cert: fs.readFileSync('_location_for_cert_'),
      }
  
  });

app.get('/', (req, res) => {
  res.send('Https: =>Hello World!');
});

app.listen({ port: 430 }, (...args) => {
  console.log('Server is running on port http://localhost:430', args);
});

```

#### Capture Params
```javascript

const JaiServer = require('jai-server');

const app = JaiServer({
    http2: true,
    allowHTTP1: true, // allow Http1.0 request
    https: // enables Https
      {
        key: fs.readFileSync('_location_for_key_'),
        cert: fs.readFileSync('_location_for_cert_'),
      }
  
  });
// url http://localhost:3000/Jai-Server
app.get('/:firstName-:lastName', (req, res) => {
  console.log(req.params)
  res.send(`Hello ${req.params.firstName} ${req.params.lastName}`);
});

app.listen({ port: 3000 }, (...args) => {
  console.log('Server is running on port http://localhost:3000', args);
});

```
#### Routes
```javascript
const JaiServer = require('jai-server');

const app = JaiServer();
const router = JaiServer.Router();
// http://localhost:3000/hello
router.get('/hello', (req, res) => {
  res.send('Hello World!');
});
app.use(router);

// http://localhost:3000
app.get('/', (req, res) => {
  res.send('Home Page!');
});

app.listen({ port: 3000 }, (...args) => {
  console.log('Server is running on port http://localhost:3000', args);
});

```
## API Reference

### Options


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `host` | `string` |  host name. default: `localhost`|
| `port` | `number` | port to use, default: `3000`|
| `static` | `object` | to serve static files `{dir: "./public_path", basePath: '/public'}`, default: `null`|
| `https` | `object` | to create secure server `{key,cert}`, default: `3000`|
| `http2` | `boolean` | to create http2 server, default: `false`|
| `allowHTTP1` | `boolean` | to serve http1 request on http2 server, default: `true`|

### Author: [@hsk11](https://github.com/hsk11)
