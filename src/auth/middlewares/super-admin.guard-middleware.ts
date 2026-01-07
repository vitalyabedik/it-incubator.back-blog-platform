import { NextFunction, Request, Response } from 'express';
import { EHttpStatus } from '../../core/constants/http';

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
export const AUTH_TYPE = 'Basic';

export const superAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    res.sendStatus(EHttpStatus.Unauthorized_401);
    return;
  }

  const [authType, token] = auth.split(' ');

  if (authType !== AUTH_TYPE) {
    res.sendStatus(EHttpStatus.Unauthorized_401);
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(EHttpStatus.Unauthorized_401);
    return;
  }

  next();
};
