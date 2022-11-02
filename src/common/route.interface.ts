import type { RequestHandler, Router } from 'express';

export interface IControllerRoute {
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
  path: string;
  handler: RequestHandler;
}
