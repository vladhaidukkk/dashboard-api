import http from 'node:http';

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      switch (req.url) {
        case '/':
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end('<h1>Hello, world!</h1>');
          break;
      }
      break;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
