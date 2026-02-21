import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { TUserRepositoryOutput } from './../../users/repositories/output/user-repository.output';
import { usersRepository } from '../../users/repositories/users.repositories';
import { TResult } from '../../core/types/result';
import { bcryptService } from '../adapters/bcrypt.service';
import { jwtService } from '../adapters/jwt.service';
import { nodemailerService } from '../adapters/nodemailer.service';
import { emailExamples } from '../adapters/emailExamples';
import { TAuthLoginInput } from '../routers/input/auth-login.input';
import { TAuthRegistrationConfirmationInput } from '../routers/input/auth-registration-confirmation-user.input';
import { TAuthRegistrationEmailResendingInput } from '../routers/input/auth-registration-email-resending-user.input';
import { EResultStatus } from '../../core/constants/resultCode';
import { EAuthValidationField } from '../constants/errors';
import { errorMessages, errorMessageVariant } from '../constants/texts';
import { mapToDbUser } from '../../users/repositories/mappers/map-to-db-user.util';
import { TUserCreateInput } from '../../users/routes/input/user-create.input';
import { TUserDB } from '../../users/domain/userDB';
import { userDeviceSessionService } from '../../securityDevices/application/user-device-session.service';
import { TAuthRefreshTokenInput } from '../routers/input/auth-refresh-token.input';
import { TAuthServiceLoginInput } from './input/auth-service-login.input';
import { TAuthServiceTokensOutput } from './output/auth-service-tokens.output';

export const authService = {
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

    const accessToken = await jwtService.createAccessToken({
      userId,
    });
    const refreshToken = await jwtService.createRefreshToken({
      userId,
      deviceId,
    });

    await userDeviceSessionService.saveUserSession({
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
  },

  async refreshToken({
    ip,
    refreshToken,
  }: TAuthRefreshTokenInput): Promise<
    TResult<TAuthServiceTokensOutput | null>
  > {
    const decodedRefreshToken =
      await jwtService.decodeRefreshToken(refreshToken);
    if (!decodedRefreshToken) {
      return {
        status: EResultStatus.Unauthorized,
        errorMessage: errorMessageVariant.credentials,
        data: null,
        extensions: [],
      };
    }

    const user = await usersRepository.findUserById(decodedRefreshToken.userId);
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
    const deviceId = decodedRefreshToken.deviceId;
    const prevIat = decodedRefreshToken.iat;

    const newAccessToken = await jwtService.createAccessToken({
      userId,
    });
    const newRefreshToken = await jwtService.createRefreshToken({
      userId,
      deviceId,
    });

    const isUpdated = await userDeviceSessionService.updateUserSession({
      prevIat,
      ip,
      refreshToken: newRefreshToken,
    });
    if (!isUpdated)
      return {
        status: EResultStatus.Unauthorized,
        errorMessage: errorMessageVariant.refreshToken,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.REFRESH_TOKEN,
            message: errorMessageVariant.refreshToken,
          },
        ],
      };

    return {
      status: EResultStatus.Success,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      extensions: [],
    };
  },

  async registerUser(
    registerDto: TUserCreateInput,
  ): Promise<TResult<string | null>> {
    const { login, password, email } = registerDto;

    const userLogin = await usersRepository.findUserByLoginOrEmail(login);
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

    const userEmail = await usersRepository.findUserByLoginOrEmail(email);
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

    const passwordHash = await bcryptService.generateHash(password);

    const newDbUser = mapToDbUser({
      userDto: registerDto,
      extraDBFields: {
        passwordHash,
        emailConfirmation: {
          isConfirmed: false,
          confirmationCode: randomUUID(),
          expirationDate: add(new Date(), { hours: 1 }).toISOString(),
        },
      },
    });

    const userId = await usersRepository.create(newDbUser);

    nodemailerService.sendEmail({
      email: newDbUser.email,
      code: newDbUser.emailConfirmation?.confirmationCode,
      template: emailExamples.registrationEmail,
    });

    return {
      status: EResultStatus.Success,
      data: userId,
      extensions: [],
    };
  },

  async registerUserConfirmation(
    dto: TAuthRegistrationConfirmationInput,
  ): Promise<TResult<null>> {
    const { code } = dto;

    const userDb = await usersRepository.findUserByConfirmationCode(code);

    if (
      !userDb ||
      userDb.emailConfirmation.isConfirmed ||
      new Date(userDb.emailConfirmation.expirationDate) < new Date()
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

    const newUserDB: TUserDB = {
      ...userDb,
      emailConfirmation: {
        isConfirmed: true,
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
      },
    };

    const isUpdated = await usersRepository.update(
      userDb._id.toString(),
      newUserDB,
    );

    if (!isUpdated) {
      return {
        status: EResultStatus.BadRequest,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.CODE,
            message: errorMessages.updateIsConfirmedInRegistrationConfirmation,
          },
        ],
        errorMessage: errorMessages.updateIsConfirmedInRegistrationConfirmation,
      };
    }

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async registerUserEmailResending(
    dto: TAuthRegistrationEmailResendingInput,
  ): Promise<TResult<null>> {
    const { email } = dto;

    const userDbByEmail = await usersRepository.findUserByLoginOrEmail(email);

    if (!userDbByEmail || userDbByEmail.emailConfirmation.isConfirmed) {
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

    const newUserDB: TUserDB = {
      ...userDbByEmail,
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
      },
    };

    const isUpdated = await usersRepository.update(
      userDbByEmail._id.toString(),
      newUserDB,
    );

    if (!isUpdated) {
      return {
        status: EResultStatus.BadRequest,
        data: null,
        extensions: [
          {
            field: EAuthValidationField.EMAIL,
            message: errorMessages.updateIsConfirmedInEmailResending,
          },
        ],
        errorMessage: errorMessages.updateIsConfirmedInEmailResending,
      };
    }

    nodemailerService.sendEmail({
      email: newUserDB.email,
      code: newUserDB.emailConfirmation?.confirmationCode,
      template: emailExamples.registrationConfirmationEmail,
    });

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  },

  async _checkUserCredentials(
    loginDto: TAuthLoginInput,
  ): Promise<TUserRepositoryOutput | null> {
    const { loginOrEmail, password } = loginDto;

    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user || !user.emailConfirmation.isConfirmed) return null;

    const isPassCorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPassCorrect) return null;

    return user;
  },
};
