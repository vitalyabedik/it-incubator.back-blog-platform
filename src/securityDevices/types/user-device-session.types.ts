import { HydratedDocument } from 'mongoose';
import { TUserDeviceSessionCreateInput } from '../routers/input/user-device-session-create.input';
import { TUserDeviceSessionUpdateInput } from '../routers/input/user-device-session-update.input';

export type TUserDeviceSession = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  iat: Date;
  expirationAt: Date;
};

export type TUserDeviceSessionDocument = HydratedDocument<TUserDeviceSession>;

export type TUserDeviceSessionStaticMethods = {
  createUserDevicesSessionInstance(
    dto: TUserDeviceSessionCreateInput,
  ): Promise<TUserDeviceSessionDocument>;
};

export type TUserDeviceSessionMethods = {
  checkIsForeignSession(userId: string): boolean;
  updateUserDeviceSession(
    dto: TUserDeviceSessionUpdateInput,
  ): TUserDeviceSessionDocument;
};
