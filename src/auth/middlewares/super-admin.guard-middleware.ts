import { NextFunction, Response } from 'express';
import { EHttpStatus } from '../../core/constants/http';
import 'dotenv/config';
import { TRequestWithQuery } from '../../core/types/request';

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const AUTH_TYPE = 'Basic';

export const superAdminGuardMiddleware = <T>(
  req: TRequestWithQuery<T>,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    res.sendStatus(EHttpStatus.UNAUTHORIZED_401);
    return;
  }

  const [authType, token] = auth.split(' ');

  if (authType !== AUTH_TYPE) {
    res.sendStatus(EHttpStatus.UNAUTHORIZED_401);
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(EHttpStatus.UNAUTHORIZED_401);
    return;
  }

  next();
};
