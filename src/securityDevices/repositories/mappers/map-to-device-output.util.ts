import { TUserDeviceSession } from '../../model/user-device-session.model';
import { TDeviceOutput } from '../output/device.output';

export const mapToDeviceOutput = (
  deviceDb: TUserDeviceSession,
): TDeviceOutput => ({
  ip: deviceDb.ip,
  title: deviceDb.deviceName,
  deviceId: deviceDb.deviceId,
  lastActiveDate: deviceDb.iat.toISOString(),
});
