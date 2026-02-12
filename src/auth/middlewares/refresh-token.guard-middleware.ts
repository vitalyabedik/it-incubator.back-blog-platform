import { NextFunction, Request, Response } from 'express';
import { EHttpStatus } from '../../core/constants/http';
import { authRepository } from '../repositories/auth.repositories';
import { jwtService } from '../adapters/jwt.service';

export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = String(req.cookies.refreshToken);
  if (!refreshToken) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  const result = await jwtService.verifyRefreshToken(refreshToken);
  if (!result) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  const revokedToken =
    await authRepository.getRevokedRefreshToken(refreshToken);

  if (revokedToken) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

  next();
};
