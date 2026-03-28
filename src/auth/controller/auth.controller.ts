import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { TRequestWithBody, TRequestWithUserId } from '../../core/types/request';
import { getRequestIp } from '../../core/utils/getRequestIp';
import { resultCodeToHttpException } from '../../core/utils/resultCodeToHttpException';
import { EResultStatus } from '../../core/constants/resultCode';
import { EHttpStatus } from '../../core/constants/http';
import { TId } from '../../core/types/id';
import { routersPaths } from '../../core/constants/paths';
import { TAuthLoginInput } from '../routers/input/auth-login.input';
import { TAuthRefreshTokenInput } from '../routers/input/auth-refresh-token.input';
import { UNKNOWN_DEVICE } from './consts';
import { TUserCreateRequestInput } from '../../users/routes/input/user-create.input';
import { UserDeviceSessionService } from '../../securityDevices/application/user-device-session.service';
import { TAuthRegistrationConfirmationInput } from '../routers/input/auth-registration-confirmation-user.input';
import { TAuthRegistrationEmailResendingInput } from '../routers/input/auth-registration-email-resending-user.input';
import { TAuthPasswordRecoveryInput } from '../routers/input/auth-password-recovery.input';
import { TAuthNewPasswordInput } from '../routers/input/auth-new-password.input';
import { UsersQueryRepository } from '../../users/repositories/users-query.repositories';
import { AuthService } from '../application/auth.service';

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(UserDeviceSessionService)
    private userDeviceSessionService: UserDeviceSessionService,
    @inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async getMe(req: TRequestWithUserId<TId>, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.sendStatus(EHttpStatus.UNAUTHORIZED_401);

    const me = await this.usersQueryRepository.getUserMeById(userId);

    res.send(me);
  }

  async login(req: TRequestWithBody<TAuthLoginInput>, res: Response) {
    const deviceName = req.headers['user-agent'] || UNKNOWN_DEVICE;
    const ip = getRequestIp(req);

    const result = await this.authService.loginUser({
      ip,
      deviceName,
      loginDto: req.body,
    });

    if (result.status !== EResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.cookie('refreshToken', result.data?.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.send({ accessToken: result.data?.accessToken });
  }

  async logout(req: TRequestWithBody<TAuthLoginInput>, res: Response) {
    const refreshToken = String(req.cookies.refreshToken);

    await this.userDeviceSessionService.deleteUserSessionByRefreshToken(
      refreshToken,
    );

    res.clearCookie('refreshToken', { path: routersPaths.root });
    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async refreshToken(
    req: TRequestWithBody<TAuthRefreshTokenInput>,
    res: Response,
  ) {
    const refreshToken = String(req.cookies.refreshToken);
    const ip = getRequestIp(req);

    const result = await this.authService.refreshToken({ ip, refreshToken });

    if (result.status !== EResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.cookie('refreshToken', result.data?.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.send({ accessToken: result.data?.accessToken });
  }

  async registration(
    req: TRequestWithBody<TUserCreateRequestInput>,
    res: Response,
  ) {
    const result = await this.authService.registerUser(req.body);

    if (result.status !== EResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async registrationConfirmation(
    req: TRequestWithBody<TAuthRegistrationConfirmationInput>,
    res: Response,
  ) {
    const result = await this.authService.registerUserConfirmation(req.body);

    if (result.status !== EResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async registrationEmailResending(
    req: TRequestWithBody<TAuthRegistrationEmailResendingInput>,
    res: Response,
  ) {
    const result = await this.authService.registerUserEmailResending(req.body);

    if (result.status !== EResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async passwordRecovery(
    req: TRequestWithBody<TAuthPasswordRecoveryInput>,
    res: Response,
  ) {
    await this.authService.passwordRecovery(req.body);

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async newPassword(
    req: TRequestWithBody<TAuthNewPasswordInput>,
    res: Response,
  ) {
    const result = await this.authService.createNewPassword(req.body);

    if (result.status !== EResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.extensions });
    }

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }
}
