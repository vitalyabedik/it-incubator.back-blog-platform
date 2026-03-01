import { TUserDB } from '../../domain/userDB';
import { TUserCreateInput } from '../../routes/input/user-create.input';

type TArgs = {
  userDto: TUserCreateInput;
  extraDBFields: Pick<
    TUserDB,
    'passwordHash' | 'emailConfirmation' | 'passwordRecovery'
  >;
};

export const mapToDbUser = ({ userDto, extraDBFields }: TArgs): TUserDB => ({
  login: userDto.login,
  email: userDto.email,
  createdAt: new Date().toISOString(),
  passwordHash: extraDBFields.passwordHash,
  emailConfirmation: {
    isConfirmed: extraDBFields.emailConfirmation.isConfirmed,
    confirmationCode: extraDBFields.emailConfirmation.confirmationCode,
    expirationDate: extraDBFields.emailConfirmation.expirationDate,
  },
  ...(extraDBFields.passwordRecovery && {
    passwordRecovery: {
      expirationDate: extraDBFields.passwordRecovery.expirationDate,
      recoveryCode: extraDBFields.passwordRecovery.recoveryCode,
    },
  }),
});
