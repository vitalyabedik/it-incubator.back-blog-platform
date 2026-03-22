import { QueryFilter } from 'mongoose';
import { TGetUserDeviceSessionBuFilterRepository } from '../input/get-user-device-session-by-filter-repository.input';
import { TUserDeviceSession } from '../../model/user-device-session.model';

export const createUserDeviceSessionFilter = ({
  deviceId,
  userId,
  iat,
}: TGetUserDeviceSessionBuFilterRepository) => {
  const filter: QueryFilter<TUserDeviceSession> = {};

  if (userId) {
    filter.userId = userId;
  }

  if (deviceId) {
    filter.deviceId = deviceId;
  }

  if (iat) {
    filter.iat = iat;
  }

  return filter;
};
