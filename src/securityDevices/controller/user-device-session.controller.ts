import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { EHttpStatus } from '../../core/constants/http';
import { EResultStatus } from '../../core/constants/resultCode';
import { resultCodeToHttpException } from '../../core/utils/resultCodeToHttpException';
import { TRequestWithParams } from '../../core/types/request';
import { JWTService } from '../../auth/adapters/jwt.service';
import { UserDeviceSessionService } from '../application/user-device-session.service';
import { UserDeviceSessionQueryRepository } from '../repositories/user-device-session-query.repositories';
import { TDeleteUserDeviceSessionParams } from './params/delete-user-device-session-params';

@injectable()
export class UserDeviceSessionController {
  constructor(
    @inject(JWTService) private jwtService: JWTService,
    @inject(UserDeviceSessionService)
    private userDeviceSessionService: UserDeviceSessionService,
    @inject(UserDeviceSessionQueryRepository)
    private userDeviceSessionQueryRepository: UserDeviceSessionQueryRepository,
  ) {}

  async getUserDeviceSessionList(req: Request, res: Response) {
    const refreshToken = String(req.cookies.refreshToken);
    const decodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    const userDeviceSessionListOutput =
      await this.userDeviceSessionQueryRepository.getUserDeviceSessionListByUserId(
        decodedRefreshToken!.userId,
      );

    res.send(userDeviceSessionListOutput);
  }

  async deleteUserDeviceSessionList(req: Request, res: Response) {
    const refreshToken = String(req.cookies.refreshToken);

    await this.userDeviceSessionService.deleteUserSessionsExceptTheCurrent(
      refreshToken,
    );

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async deleteDeviceSessionByIdHandler(
    req: TRequestWithParams<TDeleteUserDeviceSessionParams>,
    res: Response,
  ) {
    const deviceId = req.params.id;
    const refreshToken = req.cookies.refreshToken;

    const result =
      await this.userDeviceSessionService.deleteUserSessionByDeviceId({
        deviceId,
        refreshToken,
      });

    if (result.status !== EResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }
}
