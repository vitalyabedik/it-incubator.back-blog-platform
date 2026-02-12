import { add } from 'date-fns/add';
import { revokedRefreshTokenCollection } from '../../db/mongo.db';
import { TAuthRevokedRefreshTokenRepositoryOutput } from './output/auth-repository-revoked-refresh-token.output';

export const authRepository = {
  async getRevokedRefreshToken(
    refreshToken: string,
  ): Promise<TAuthRevokedRefreshTokenRepositoryOutput | null> {
    return revokedRefreshTokenCollection.findOne({ refreshToken });
  },

  async addRevokedRefreshToken(refreshToken: string): Promise<string> {
    const { insertedId } = await revokedRefreshTokenCollection.insertOne({
      refreshToken,
      expiredAt: add(new Date(), { hours: 8 }),
    });

    return insertedId.toString();
  },
};
