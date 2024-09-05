export const ErrorHandler500=(res:any,error:any) => {
    error= error instanceof Error ? error : error?.toString();
    console.log(error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ statusCode: 500, message: 'Internal Server Error - Jai Server', error: error?.message||error }));
      res.end();
    }
  }