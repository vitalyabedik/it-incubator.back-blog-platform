import { inject, injectable } from 'inversify';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
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
import { mapToDbUser } from '../../users/repositories/mappers/map-to-db-user.util';
import { TUserCreateInput } from '../../users/routes/input/user-create.input';
import { UserDeviceSessionService } from '../../securityDevices/application/user-device-session.service';
import { TAuthRefreshTokenInput } from '../routers/input/auth-refresh-token.input';
import { TAuthPasswordRecoveryInput } from '../routers/input/auth-password-recovery.input';
import { TAuthServiceLoginInput } from './input/auth-service-login.input';
import { TAuthServiceTokensOutput } from './output/auth-service-tokens.output';
import { TAuthNewPasswordInput } from '../routers/input/auth-new-password.input';
import { UserDeviceSessionRepository } from '../../securityDevices/repositories/user-device-session.repositories';
import { convertUnixTimeToDate } from '../../core/utils/convert-unix-time-to-date';
import { TUser, TUserDocument } from '../../users/model/user.model';

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
    });
    const refreshToken = await this.jwtService.createRefreshToken({
      userId,
      deviceId,
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
    });
    const newRefreshToken = await this.jwtService.createRefreshToken({
      userId,
      deviceId,
    });

    const newDecodedRefreshToken =
      await this.jwtService.decodeRefreshToken(refreshToken);

    session.ip = ip;
    session.iat = convertUnixTimeToDate(newDecodedRefreshToken!.iat);
    session.expirationAt = convertUnixTimeToDate(newDecodedRefreshToken!.exp);

    await this.userDeviceSessionRepository.saveSession(session);

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
    registerDto: TUserCreateInput,
  ): Promise<TResult<string | null>> {
    const { login, password, email } = registerDto;

    const userLogin = await this.usersRepository.findUserByLoginOrEmail(login);
    if (userLogin)
      return {
        status: EResultStatus.BadRequest,
        errorMessage: errorMessageVariant.credentials,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.LOGIN,
            message: errorMessages.uniqueUser,
          },
        ],
      };

    const userEmail = await this.usersRepository.findUserByLoginOrEmail(email);
    if (userEmail)
      return {
        status: EResultStatus.BadRequest,
        errorMessage: errorMessageVariant.credentials,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.EMAIL,
            message: errorMessages.uniqueUser,
          },
        ],
      };

    const passwordHash = await this.bcryptService.generateHash(password);

    const newDbUser: Omit<TUser, '_id'> = mapToDbUser({
      userDto: registerDto,
      extraDBFields: {
        passwordHash,
        emailConfirmation: {
          isConfirmed: false,
          confirmationCode: randomUUID(),
          expirationDate: add(new Date(), { hours: 1 }),
        },
      },
    });

    const userId = await this.usersRepository.create(newDbUser);

    this.nodemailerService.sendEmail({
      email: newDbUser.email,
      code: newDbUser.emailConfirmation?.confirmationCode,
      template: registrationExamples.registrationEmail,
    });

    return {
      status: EResultStatus.Success,
      data: userId,
      extensions: [],
    };
  }

  async registerUserConfirmation(
    dto: TAuthRegistrationConfirmationInput,
  ): Promise<TResult<null>> {
    const { code } = dto;

    const userDb = await this.usersRepository.findUserByConfirmationCode(code);

    if (
      !userDb ||
      userDb.emailConfirmation.isConfirmed ||
      (userDb.emailConfirmation.expirationDate &&
        userDb.emailConfirmation.expirationDate < new Date())
    ) {
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

    userDb.emailConfirmation = {
      isConfirmed: true,
      confirmationCode: '',
      expirationDate: null,
    };

    await this.usersRepository.saveUser(userDb);

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
    if (!user || user.emailConfirmation.isConfirmed) {
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

    user.emailConfirmation = {
      isConfirmed: false,
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), { hours: 1 }),
    };

    await this.usersRepository.saveUser(user);

    this.nodemailerService.sendEmail({
      email: user.email,
      code: user.emailConfirmation?.confirmationCode,
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
      const recoveryCode = randomUUID();

      user.passwordRecovery = {
        recoveryCode,
        expirationDate: add(new Date(), { hours: 1 }),
      };

      await this.usersRepository.saveUser(user);

      this.nodemailerService
        .sendEmail({
          email,
          code: recoveryCode,
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
      !user.passwordRecovery ||
      (user.passwordRecovery.expirationDate &&
        user.passwordRecovery.expirationDate < new Date())
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

    user.passwordHash = passwordHash;

    await this.usersRepository.saveUser(user);

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
    if (!user || !user.emailConfirmation.isConfirmed) return null;

    const isPassCorrect = await this.bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPassCorrect) return null;

    return user;
  }
}
