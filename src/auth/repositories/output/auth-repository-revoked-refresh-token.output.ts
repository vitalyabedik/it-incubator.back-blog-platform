import { WithId } from 'mongodb';
import { TRevokedRefreshTokenDB } from '../../domain/revokedRefreshTokenDB';

export type TAuthRevokedRefreshTokenRepositoryOutput =
  WithId<TRevokedRefreshTokenDB>;
