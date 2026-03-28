import { TUserDeviceSession } from '../../types/user-device-session.types';
import { TUserDeviceSessionCreateInput } from './../../routers/input/user-device-session-create.input';

export const mapToDeviceDocument = (
  dto: TUserDeviceSessionCreateInput,
): TUserDeviceSession => ({
  userId: dto.userId,
  deviceId: dto.deviceId,
  deviceName: dto.deviceName,
  ip: dto.ip,
  iat: dto.iat,
  expirationAt: dto.expirationAt,
});
