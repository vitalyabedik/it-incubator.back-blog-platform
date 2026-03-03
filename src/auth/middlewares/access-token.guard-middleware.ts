import { NextFunction, Request, Response } from 'express';
import { EHttpStatus } from '../../core/constants/http';
import { TId } from '../../core/types/id';
import { JWTService } from '../adapters/jwt.service';
import { iocContainer } from '../../composition-root';

const jwtService = iocContainer.get(JWTService);

export const accessTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  const [authType, token] = auth.split(' ');

  if (authType !== 'Bearer')
    return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  const payload = await jwtService.verifyAccessToken(token);
  if (!payload) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  const { userId } = payload;
  req.user = { id: userId } as TId;

  next();
};
