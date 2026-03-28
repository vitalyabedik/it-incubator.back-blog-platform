import { Types } from 'mongoose';
import { TUserDeviceSession } from '../../types/user-device-session.types';
import { TDeviceOutput } from '../output/device.output';

type TArgs = { _id: Types.ObjectId } & TUserDeviceSession;

export const mapToDeviceOutput = (deviceDocument: TArgs): TDeviceOutput => ({
  ip: deviceDocument.ip,
  title: deviceDocument.deviceName,
  deviceId: deviceDocument.deviceId,
  lastActiveDate: deviceDocument.iat.toISOString(),
});
