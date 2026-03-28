import { TUserCreateInput } from '../../routes/input/user-create.input';
import { TUser, TUserDocument } from '../../types/user.types';

type TArgs = {
  userDto: TUserCreateInput;
  extraDBFields: Pick<TUserDocument, 'emailConfirmation' | 'passwordRecovery'>;
};

export const mapToDocumentUser = ({
  userDto,
  extraDBFields,
}: TArgs): TUser => ({
  login: userDto.login,
  email: userDto.email,
  passwordHash: userDto.passwordHash,
  createdAt: new Date(),
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
