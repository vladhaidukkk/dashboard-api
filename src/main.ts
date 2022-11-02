import express, { Request, Response } from 'express';

const port = 8080;

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello, world!</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
