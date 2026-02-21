import { TDeviceDB } from '../../domain/deviceDB';
import { TDeviceOutput } from '../output/device.output';

export const mapToDeviceOutput = (deviceDb: TDeviceDB): TDeviceOutput => ({
  ip: deviceDb.ip,
  title: deviceDb.deviceName,
  deviceId: deviceDb.deviceId,
  lastActiveDate: new Date(deviceDb.iat * 1000).toISOString(),
});
