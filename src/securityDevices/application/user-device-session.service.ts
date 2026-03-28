import { inject, injectable } from 'inversify';
import { JWTService } from '../../auth/adapters/jwt.service';
import { EResultStatus } from '../../core/constants/resultCode';
import { EUserDeviceSessionField } from '../constants/errors';
import { errorMessages } from '../constants/texts';
import { UserDeviceSessionRepository } from '../repositories/user-device-session.repositories';
import { TSaveUserDeviceSessionParams } from './params/save-user-device-session.params';
import { convertUnixTimeToDate } from '../../core/utils/convert-unix-time-to-date';
import { UserDeviceSessionModel } from '../model/user-device-session.model';

@injectable()
export class UserDeviceSessionService {
  constructor(
    @inject(JWTService) private jwtService: JWTService,
    @inject(UserDeviceSessionRepository)
    private userDeviceSessionRepository: UserDeviceSessionRepository,
  ) {}

  async saveUserSession(args: TSaveUserDeviceSessionParams) {
    const { ip, deviceId, deviceName, refreshToken, userId } = args;

    const decodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    const userDeviceSession = {
      userId,
      deviceId,
      deviceName,
      ip,
      iat: convertUnixTimeToDate(decodedRefreshToken!.iat),
      expirationAt: convertUnixTimeToDate(decodedRefreshToken!.exp),
    };

    const userDeviceSessionDocument =
      await UserDeviceSessionModel.createUserDevicesSessionInstance(
        userDeviceSession,
      );

    return {
      status: EResultStatus.Success,
      data: { id: userDeviceSessionDocument._id.toString() },
      extensions: [],
    };
  }

  async deleteUserSessionsExceptTheCurrent(refreshToken: string) {
    const decodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    await this.userDeviceSessionRepository.deleteUserDeviceSessionListExceptTheCurrent(
      decodedRefreshToken!.deviceId,
    );

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async deleteUserSessionByRefreshToken(refreshToken: string) {
    const decodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    const isDeleted =
      await this.userDeviceSessionRepository.deleteUserDeviceSessionByDeviceId(
        decodedRefreshToken!.deviceId,
      );
    if (!isDeleted) {
      return {
        status: EResultStatus.NotFound,
        data: null,
        extensions: [
          {
            field: EUserDeviceSessionField.DEVICE_ID,
            message: errorMessages.notFound,
          },
        ],
      };
    }

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async deleteUserSessionByDeviceId({
    deviceId,
    refreshToken,
  }: {
    deviceId: string;
    refreshToken: string;
  }) {
    const decodedToken =
      await this.jwtService.decodeRefreshToken(refreshToken)!;

    const userDeviceSession =
      await this.userDeviceSessionRepository.getUserDeviceSessionByFilter({
        deviceId,
      });

    if (!userDeviceSession)
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

    if (userDeviceSession.checkIsForeignSession(decodedToken!.userId))
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

    await this.userDeviceSessionRepository.deleteUserDeviceSessionByDeviceId(
      deviceId,
    );

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
