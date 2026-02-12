import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../core/settings';

const TOKEN_DECODE_ERROR_MESSAGE = 'Произошла ошибка при decode token';
const TOKEN_VERIFY_ERROR_MESSAGE = 'Произошла ошибка при verify token';

type TTokenArgs = {
  userId: string;
};

export const jwtService = {
  async createAccessToken(args: TTokenArgs): Promise<string> {
    return jwt.sign(args, SETTINGS.AC_SECRET, {
      expiresIn: Number(SETTINGS.AC_TIME),
    });
  },

  async verifyAccessToken(token: string): Promise<TTokenArgs | null> {
    try {
      return jwt.verify(token, SETTINGS.AC_SECRET) as TTokenArgs;
    } catch (error) {
      console.error(TOKEN_VERIFY_ERROR_MESSAGE, error);
      return null;
    }
  },

  async createRefreshToken(args: TTokenArgs): Promise<string> {
    return jwt.sign(args, SETTINGS.RT_SECRET, {
      expiresIn: Number(SETTINGS.RT_TIME),
    });
  },

  async verifyRefreshToken(token: string): Promise<TTokenArgs | null> {
    try {
      return jwt.verify(token, SETTINGS.RT_SECRET) as TTokenArgs;
    } catch (error) {
      console.error(TOKEN_VERIFY_ERROR_MESSAGE, error);
      return null;
    }
  },

  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (error: unknown) {
      console.error(TOKEN_DECODE_ERROR_MESSAGE, error);
      return null;
    }
  },
};
