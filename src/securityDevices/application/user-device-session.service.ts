import { jwtService } from '../../auth/adapters/jwt.service';
import { EResultStatus } from '../../core/constants/resultCode';
import { EUserDeviceSessionField } from '../constants/errors';
import { errorMessages } from '../constants/texts';
import { userDeviceSessionRepository } from '../repositories/user-device-session.repositories';
import { TSaveUserDeviceSessionParams } from './params/save-user-device-session.params';

type UpdateSessionArgs = {
  prevIat: number;
  ip: string;
  refreshToken: string;
};

export const userDeviceSessionService = {
  async saveUserSession(args: TSaveUserDeviceSessionParams) {
    const { ip, deviceId, deviceName, refreshToken, userId } = args;

    const decodedRefreshToken =
      await jwtService.decodeRefreshToken(refreshToken);

    const userDeviceSession = {
      userId,
      deviceId,
      deviceName,
      ip,
      iat: decodedRefreshToken!.iat,
      expirationAt: decodedRefreshToken!.exp,
      expirationDate: new Date(decodedRefreshToken!.exp * 1000),
    };

    await userDeviceSessionRepository.addUserDeviceSession(userDeviceSession);
  },

  async updateUserSession({ prevIat, ip, refreshToken }: UpdateSessionArgs) {
    const decodedRefreshToken =
      await jwtService.decodeRefreshToken(refreshToken);

    return await userDeviceSessionRepository.updateUserDeviceSession({
      deviceId: decodedRefreshToken!.deviceId,
      prevIat,
      ip,
      iat: decodedRefreshToken!.iat,
      expirationAt: decodedRefreshToken!.exp,
      expirationDate: new Date(decodedRefreshToken!.exp * 1000),
    });
  },

  async deleteUserSessionsExceptTheCurrent(refreshToken: string) {
    const decodedRefreshToken =
      await jwtService.decodeRefreshToken(refreshToken);

    await userDeviceSessionRepository.deleteUserDeviceSessionListExceptTheCurrent(
      decodedRefreshToken!.deviceId,
    );
  },

  async deleteUserSessionByRefreshToken(refreshToken: string) {
    const decodedRefreshToken =
      await jwtService.decodeRefreshToken(refreshToken);

    await userDeviceSessionRepository.deleteUserDeviceSessionByDeviceId(
      decodedRefreshToken!.deviceId,
    );

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async deleteUserSessionByDeviceId({
    deviceId,
    refreshToken,
  }: {
    deviceId: string;
    refreshToken: string;
  }) {
    const decodedToken = await jwtService.decodeRefreshToken(refreshToken);

    const sessionForDeleting =
      await userDeviceSessionRepository.getUserDeviceSessionByFilter({
        deviceId,
      });

    if (!sessionForDeleting)
      return {
        status: EResultStatus.NotFound,
        errorMessage: errorMessages.notFound,
        data: null,
        extensions: [
          {
            field: EUserDeviceSessionField.DEVICE_ID,
            message: errorMessages.notFound,
          },
        ],
      };

    const isMySession = Boolean(
      await userDeviceSessionRepository.getUserDeviceSessionByFilter({
        deviceId,
        userId: decodedToken!.userId,
      }),
    );

    if (!isMySession)
      return {
        status: EResultStatus.Forbidden,
        errorMessage: errorMessages.noCurrentOwner,
        data: null,
        extensions: [
          {
            field: EUserDeviceSessionField.DEVICE_ID,
            message: errorMessages.noCurrentOwner,
          },
        ],
      };

    await userDeviceSessionRepository.deleteUserDeviceSessionByDeviceId(
      deviceId,
    );

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
};
