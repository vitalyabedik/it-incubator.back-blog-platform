import { inject, injectable } from 'inversify';
import { JWTService } from '../../auth/adapters/jwt.service';
import { EResultStatus } from '../../core/constants/resultCode';
import { EUserDeviceSessionField } from '../constants/errors';
import { errorMessages } from '../constants/texts';
import { UserDeviceSessionRepository } from '../repositories/user-device-session.repositories';
import { TSaveUserDeviceSessionParams } from './params/save-user-device-session.params';
import { TUpdateSessionParams } from './params/update-user-device-session.params';

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
      iat: decodedRefreshToken!.iat,
      expirationAt: decodedRefreshToken!.exp,
      expirationDate: new Date(decodedRefreshToken!.exp * 1000),
    };

    await this.userDeviceSessionRepository.addUserDeviceSession(
      userDeviceSession,
    );
  }

  async updateUserSession({ prevIat, ip, refreshToken }: TUpdateSessionParams) {
    const decodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    return await this.userDeviceSessionRepository.updateUserDeviceSession({
      deviceId: decodedRefreshToken!.deviceId,
      prevIat,
      ip,
      iat: decodedRefreshToken!.iat,
      expirationAt: decodedRefreshToken!.exp,
      expirationDate: new Date(decodedRefreshToken!.exp * 1000),
    });
  }

  async deleteUserSessionsExceptTheCurrent(refreshToken: string) {
    const decodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    await this.userDeviceSessionRepository.deleteUserDeviceSessionListExceptTheCurrent(
      decodedRefreshToken!.deviceId,
    );
  }

  async deleteUserSessionByRefreshToken(refreshToken: string) {
    const decodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    await this.userDeviceSessionRepository.deleteUserDeviceSessionByDeviceId(
      decodedRefreshToken!.deviceId,
    );

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
    const decodedToken = await this.jwtService.decodeRefreshToken(refreshToken);

    const sessionForDeleting =
      await this.userDeviceSessionRepository.getUserDeviceSessionByFilter({
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
      await this.userDeviceSessionRepository.getUserDeviceSessionByFilter({
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
