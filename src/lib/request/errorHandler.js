module.exports=(res,error) => {
    console.log(error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ statusCode: 500, error: 'Internal Server Error - Jai Server', message: error.message }));
      res.end();
    }
  }