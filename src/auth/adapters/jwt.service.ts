import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../core/settings';

const ACCESS_TOKEN_DECODE_ERROR_MESSAGE =
  'Произошла ошибка при decode access token';
const REFRESH_TOKEN_DECODE_ERROR_MESSAGE =
  'Произошла ошибка при decode refresh token';
const ACCESS_TOKEN_VERIFY_ERROR_MESSAGE =
  'Произошла ошибка при verify access token';
const REFRESH_TOKEN_VERIFY_ERROR_MESSAGE =
  'Произошла ошибка при verify refresh token';

type TAccessTokenArgs = {
  userId: string;
  login: string;
};

type TRefreshTokenArgs = TAccessTokenArgs & {
  deviceId: string;
};

type TVerifyRefreshTokenArgs = TRefreshTokenArgs & { iat: number; exp: number };

@injectable()
export class JWTService {
  constructor() {}

  async createAccessToken(args: TAccessTokenArgs): Promise<string> {
    return jwt.sign(args, SETTINGS.AC_SECRET, {
      expiresIn: Number(SETTINGS.AC_TIME),
    });
  }

  async verifyAccessToken(
    accessToken: string,
  ): Promise<TAccessTokenArgs | null> {
    try {
      return jwt.verify(accessToken, SETTINGS.AC_SECRET) as TAccessTokenArgs;
    } catch (error) {
      console.error(ACCESS_TOKEN_VERIFY_ERROR_MESSAGE, error);
      return null;
    }
  }

  async createRefreshToken(args: TRefreshTokenArgs): Promise<string> {
    return jwt.sign(args, SETTINGS.RT_SECRET, {
      expiresIn: Number(SETTINGS.RT_TIME),
    });
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<TVerifyRefreshTokenArgs | null> {
    try {
      return jwt.verify(
        refreshToken,
        SETTINGS.RT_SECRET,
      ) as TVerifyRefreshTokenArgs;
    } catch (error) {
      console.error(REFRESH_TOKEN_VERIFY_ERROR_MESSAGE, error);
      return null;
    }
  }

  async decodeAccessToken(
    accessToken: string,
  ): Promise<TAccessTokenArgs | null> {
    try {
      return jwt.decode(accessToken) as TAccessTokenArgs;
    } catch (error: unknown) {
      console.error(ACCESS_TOKEN_DECODE_ERROR_MESSAGE, error);
      return null;
    }
  }

  async decodeRefreshToken(
    refreshToken: string,
  ): Promise<TVerifyRefreshTokenArgs | null> {
    try {
      return jwt.decode(refreshToken) as TVerifyRefreshTokenArgs;
    } catch (error: unknown) {
      console.error(REFRESH_TOKEN_DECODE_ERROR_MESSAGE, error);
      return null;
    }
  }
}
