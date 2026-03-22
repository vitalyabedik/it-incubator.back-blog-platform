import { TUser, TUserDocument } from '../../model/user.model';
import { TUserCreateInput } from '../../routes/input/user-create.input';

type TArgs = {
  userDto: TUserCreateInput;
  extraDBFields: Pick<
    TUserDocument,
    'passwordHash' | 'emailConfirmation' | 'passwordRecovery'
  >;
};

export const mapToDbUser = ({
  userDto,
  extraDBFields,
}: TArgs): Omit<TUser, '_id'> => ({
  login: userDto.login,
  email: userDto.email,
  createdAt: new Date(),
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
