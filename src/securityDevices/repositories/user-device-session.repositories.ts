import { injectable } from 'inversify';
import {
  TUserDeviceSession,
  TUserDeviceSessionDocument,
  UserDeviceSessionModel,
} from '../model/user-device-session.model';
import { TGetUserDeviceSessionBuFilterRepository } from './input/get-user-device-session-by-filter-repository.input';
import { createUserDeviceSessionFilter } from './utils/create-user-device-session-filter';

@injectable()
export class UserDeviceSessionRepository {
  constructor() {}

  async getUserDeviceSessionListByUserId(userId: string) {
    return UserDeviceSessionModel.find({ userId }).exec();
  }

  async getUserDeviceSessionByFilter(
    filter: TGetUserDeviceSessionBuFilterRepository,
  ) {
    const deviceFilter = createUserDeviceSessionFilter(filter);
    if (Object.keys(deviceFilter).length === 0) return null;

    return UserDeviceSessionModel.findOne(deviceFilter).exec();
  }

  async addUserDeviceSession(
    userDeviceSession: Omit<TUserDeviceSession, '_id'>,
  ): Promise<string> {
    const { id } = await UserDeviceSessionModel.create(userDeviceSession);

    return id;
  }

  async deleteUserDeviceSessionListExceptTheCurrent(deviceId: string) {
    const { deletedCount } = await UserDeviceSessionModel.deleteMany({
      deviceId: { $ne: deviceId },
    });

    return deletedCount > 0;
  }

  async deleteUserDeviceSessionByDeviceId(deviceId: string) {
    const { deletedCount } = await UserDeviceSessionModel.deleteOne({
      deviceId,
    });

    return deletedCount > 0;
  }

  async saveSession(userDeviceSession: TUserDeviceSessionDocument) {
    await userDeviceSession.save();
  }
}
