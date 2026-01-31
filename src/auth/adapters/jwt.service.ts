import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../core/settings';

const TOKEN_DECODE_ERROR_MESSAGE = 'Произошла ошибка при decode token';
const TOKEN_VERIFY_ERROR_MESSAGE = 'Произошла ошибка при verify token';

type TAccessTokenArgs = {
  userId: string;
};

export const jwtService = {
  async createToken(args: TAccessTokenArgs): Promise<string> {
    return jwt.sign(args, SETTINGS.AC_SECRET, {
      expiresIn: Number(SETTINGS.AC_TIME),
    });
  },

  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (error: unknown) {
      console.error(TOKEN_DECODE_ERROR_MESSAGE, error);
      return null;
    }
  },

  async verifyToken(token: string): Promise<TAccessTokenArgs | null> {
    try {
      return jwt.verify(token, SETTINGS.AC_SECRET) as TAccessTokenArgs;
    } catch (error) {
      console.error(TOKEN_VERIFY_ERROR_MESSAGE, error);
      return null;
    }
  },
};
