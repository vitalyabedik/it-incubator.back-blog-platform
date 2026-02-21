import { Filter } from 'mongodb';
import { TDeviceDB } from '../../domain/deviceDB';
import { TGetUserDeviceSessionBuFilterRepository } from '../input/get-user-device-session-by-filter-repository.input';

export const createUserDeviceSessionFilter = ({
  deviceId,
  userId,
}: TGetUserDeviceSessionBuFilterRepository) => {
  const filter: Filter<TDeviceDB> = {};

  if (userId) {
    filter.userId = userId;
  }

  if (deviceId) {
    filter.deviceId = deviceId;
  }

  return filter;
};
