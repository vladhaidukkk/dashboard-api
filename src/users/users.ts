import { Request, Response, Router } from 'express';

const usersRouter = Router();

usersRouter.post('/login', (req: Request, res: Response) => {
  res.send('Logger in');
});

usersRouter.post('/register', (req: Request, res: Response) => {
  res.status(201).send('Registered');
});

export { usersRouter };
