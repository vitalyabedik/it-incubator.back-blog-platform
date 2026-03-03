import { injectable } from 'inversify';
import { securityDevicesCollection } from '../../db/mongo.db';
import { TDeviceDB } from '../domain/deviceDB';
import { TGetUserDeviceSessionBuFilterRepository } from './input/get-user-device-session-by-filter-repository.input';
import { TUpdateUserDeviceSessionRepository } from './input/update-user-device-session-repository.input';
import { createUserDeviceSessionFilter } from './utils/create-user-device-session-filter';

@injectable()
export class UserDeviceSessionRepository {
  constructor() {}

  async getUserDeviceSessionListByUserId(userId: string) {
    return await securityDevicesCollection.find({ userId }).toArray();
  }

  async getUserDeviceSessionByFilter(
    filter: TGetUserDeviceSessionBuFilterRepository,
  ) {
    const deviceFilter = createUserDeviceSessionFilter(filter);
    if (Object.keys(deviceFilter).length === 0) return null;

    return await securityDevicesCollection.findOne(deviceFilter);
  }

  async addUserDeviceSession(userDeviceSession: TDeviceDB): Promise<string> {
    const { insertedId } =
      await securityDevicesCollection.insertOne(userDeviceSession);

    return insertedId.toString();
  }

  async updateUserDeviceSession({
    deviceId,
    prevIat,
    ...restData
  }: TUpdateUserDeviceSessionRepository): Promise<boolean> {
    const { modifiedCount } = await securityDevicesCollection.updateOne(
      { deviceId, iat: prevIat },
      { $set: restData },
    );

    return modifiedCount > 0;
  }

  async deleteUserDeviceSessionListExceptTheCurrent(deviceId: string) {
    const { deletedCount } = await securityDevicesCollection.deleteMany({
      deviceId: { $ne: deviceId },
    });

    return deletedCount > 0;
  }

  async deleteUserDeviceSessionByDeviceId(deviceId: string) {
    const { deletedCount } = await securityDevicesCollection.deleteOne({
      deviceId,
    });

    return deletedCount > 0;
  }
}
