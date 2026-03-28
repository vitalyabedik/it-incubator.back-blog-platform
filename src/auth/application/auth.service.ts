import { inject, injectable } from 'inversify';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../users/repositories/users.repositories';
import { TResult } from '../../core/types/result';
import { BcryptService } from '../adapters/bcrypt.service';
import { JWTService } from '../adapters/jwt.service';
import { NodemailerService } from '../adapters/nodemailer.service';
import { registrationExamples } from '../adapters/registrationExamples';
import { TAuthLoginInput } from '../routers/input/auth-login.input';
import { TAuthRegistrationConfirmationInput } from '../routers/input/auth-registration-confirmation-user.input';
import { TAuthRegistrationEmailResendingInput } from '../routers/input/auth-registration-email-resending-user.input';
import { EResultStatus } from '../../core/constants/resultCode';
import { EAuthValidationField } from '../constants/errors';
import { errorMessages, errorMessageVariant } from '../constants/texts';
import { TUserCreateRequestInput } from '../../users/routes/input/user-create.input';
import { UserDeviceSessionService } from '../../securityDevices/application/user-device-session.service';
import { TAuthRefreshTokenInput } from '../routers/input/auth-refresh-token.input';
import { TAuthPasswordRecoveryInput } from '../routers/input/auth-password-recovery.input';
import { TAuthServiceLoginInput } from './input/auth-service-login.input';
import { TAuthServiceTokensOutput } from './output/auth-service-tokens.output';
import { TAuthNewPasswordInput } from '../routers/input/auth-new-password.input';
import { UserDeviceSessionRepository } from '../../securityDevices/repositories/user-device-session.repositories';
import { convertUnixTimeToDate } from '../../core/utils/convert-unix-time-to-date';
import { TUserDocument } from '../../users/types/user.types';
import { UserModel } from '../../users/model/user.model';

@injectable()
export class AuthService {
  constructor(
    @inject(BcryptService) private bcryptService: BcryptService,
    @inject(JWTService) private jwtService: JWTService,
    @inject(NodemailerService) private nodemailerService: NodemailerService,
    @inject(UserDeviceSessionService)
    private userDeviceSessionService: UserDeviceSessionService,
    @inject(UserDeviceSessionRepository)
    private userDeviceSessionRepository: UserDeviceSessionRepository,
    @inject(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async loginUser({
    deviceName,
    ip,
    loginDto,
  }: TAuthServiceLoginInput): Promise<
    TResult<TAuthServiceTokensOutput | null>
  > {
    const user = await this._checkUserCredentials(loginDto);
    if (!user) {
      return {
        status: EResultStatus.Unauthorized,
        errorMessage: errorMessageVariant.credentials,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.CREDENTIALS,
            message: errorMessageVariant.credentials,
          },
        ],
      };
    }

    const userId = user._id.toString();
    const deviceId = randomUUID();

    const accessToken = await this.jwtService.createAccessToken({
      userId,
      login: user.login,
    });
    const refreshToken = await this.jwtService.createRefreshToken({
      userId,
      deviceId,
      login: user.login,
    });

    await this.userDeviceSessionService.saveUserSession({
      userId,
      refreshToken,
      deviceId,
      ip,
      deviceName,
    });

    return {
      status: EResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  }

  async refreshToken({
    ip,
    refreshToken,
  }: TAuthRefreshTokenInput): Promise<
    TResult<TAuthServiceTokensOutput | null>
  > {
    const decodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);
    if (!decodedRefreshToken) {
      return {
        status: EResultStatus.Unauthorized,
        errorMessage: errorMessageVariant.credentials,
        data: null,
        extensions: [],
      };
    }

    const user = await this.usersRepository.findUserById(
      decodedRefreshToken.userId,
    );
    if (!user) {
      return {
        status: EResultStatus.Unauthorized,
        errorMessage: errorMessageVariant.credentials,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.CREDENTIALS,
            message: errorMessageVariant.credentials,
          },
        ],
      };
    }

    const session =
      await this.userDeviceSessionRepository.getUserDeviceSessionByFilter({
        deviceId: decodedRefreshToken.deviceId,
        iat: convertUnixTimeToDate(decodedRefreshToken.iat),
      });
    if (!session) {
      return {
        status: EResultStatus.NotFound,
        errorMessage: errorMessageVariant.refreshToken,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.DEVICE_ID,
            message: errorMessages.notFoundSession,
          },
        ],
      };
    }

    const userId = user._id.toString();
    const deviceId = decodedRefreshToken.deviceId;

    const newAccessToken = await this.jwtService.createAccessToken({
      userId,
      login: user.login,
    });
    const newRefreshToken = await this.jwtService.createRefreshToken({
      userId,
      deviceId,
      login: user.login,
    });

    const newDecodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    const userDevicesSessionDocument = session.updateUserDeviceSession({
      ip,
      iat: convertUnixTimeToDate(newDecodedRefreshToken!.iat),
      expirationAt: convertUnixTimeToDate(newDecodedRefreshToken!.exp),
    });

    await this.userDeviceSessionRepository.saveSession(
      userDevicesSessionDocument,
    );

    return {
      status: EResultStatus.Success,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      extensions: [],
    };
  }

  async registerUser(
    registerDto: TUserCreateRequestInput,
  ): Promise<TResult<string | null>> {
    const { login, password, email } = registerDto;

    const result = await UserModel.checkIsUserExist(registerDto);
    if (result.isExist)
      return {
        status: EResultStatus.BadRequest,
        errorMessage: errorMessageVariant.credentials,
        data: null,
        extensions: [
          {
            field: result.byField,
            message: errorMessages.uniqueUser,
          },
        ],
      };

    const passwordHash = await this.bcryptService.generateHash(password);

    const { userDocument, confirmationCode } =
      await UserModel.createUnconfirmedUserInstance({
        login,
        email,
        passwordHash,
      });

    this.nodemailerService.sendEmail({
      email,
      code: confirmationCode,
      template: registrationExamples.registrationEmail,
    });

    return {
      status: EResultStatus.Success,
      data: userDocument._id.toString(),
      extensions: [],
    };
  }

  async registerUserConfirmation(
    dto: TAuthRegistrationConfirmationInput,
  ): Promise<TResult<null>> {
    const { code } = dto;

    const user = await this.usersRepository.findUserByConfirmationCode(code);

    if (!user || user.checkIsConfirmed() || user.checkIsConfirmationExpired()) {
      return {
        data: null,
        status: EResultStatus.BadRequest,
        extensions: [
          {
            field: EAuthValidationField.CODE,
            message: errorMessages.codeConfirmation,
          },
        ],
        errorMessage: errorMessages.codeConfirmation,
      };
    }

    const userDocument = user.confirmUser();

    await this.usersRepository.saveUser(userDocument);

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async registerUserEmailResending(
    dto: TAuthRegistrationEmailResendingInput,
  ): Promise<TResult<null>> {
    const { email } = dto;

    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user || user.checkIsConfirmed()) {
      return {
        data: null,
        status: EResultStatus.BadRequest,
        extensions: [
          {
            field: EAuthValidationField.EMAIL,
            message: errorMessages.emailResending,
          },
        ],
        errorMessage: errorMessages.emailResending,
      };
    }

    const userDocument = user.updateUserConfirmationData();

    await this.usersRepository.saveUser(userDocument);

    this.nodemailerService.sendEmail({
      email: user.email,
      code: userDocument.emailConfirmation.confirmationCode,
      template: registrationExamples.registrationConfirmationEmail,
    });

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async passwordRecovery(dto: TAuthPasswordRecoveryInput) {
    const { email } = dto;

    const user = await this.usersRepository.findUserByLoginOrEmail(email);

    if (user) {
      const userDocument = user.setPasswordRecoveryData();

      await this.usersRepository.saveUser(userDocument);

      this.nodemailerService
        .sendEmail({
          email,
          code: userDocument.passwordRecovery!.recoveryCode,
          template: registrationExamples.recoveryPassword,
        })
        .catch((err) => console.log(err));
    }

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async createNewPassword(dto: TAuthNewPasswordInput) {
    const { newPassword, recoveryCode } = dto;

    const user =
      await this.usersRepository.findUserByRecoveryCode(recoveryCode);

    if (
      !user ||
      !user.checkIsRecoveryPasswordExist() ||
      user.checkIsRecoveryPasswordExpired()
    ) {
      return {
        status: EResultStatus.BadRequest,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.RECOVERY_CODE,
            message: errorMessages.newPassword,
          },
        ],
        errorMessage: errorMessages.newPassword,
      };
    }

    const passwordHash = await this.bcryptService.generateHash(newPassword);

    const userDocument = user.updateUserPassword(passwordHash);

    await this.usersRepository.saveUser(userDocument);

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async _checkUserCredentials(
    loginDto: TAuthLoginInput,
  ): Promise<TUserDocument | null> {
    const { loginOrEmail, password } = loginDto;

    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user || !user.checkIsConfirmed()) return null;

    const isPassCorrect = await this.bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPassCorrect) return null;

    return user;
  }
}
