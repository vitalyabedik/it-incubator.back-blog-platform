import { TUserDB } from '../../domain/userDB';
import { TUserCreateInput } from '../../routes/input/user-create.input';

type TArgs = {
  userDto: TUserCreateInput;
  extraDBFields: Pick<TUserDB, 'passwordHash' | 'emailConfirmation'>;
};

export const mapToDbUser = ({ userDto, extraDBFields }: TArgs): TUserDB => ({
  login: userDto.login,
  email: userDto.email,
  passwordHash: extraDBFields.passwordHash,
  createdAt: new Date().toISOString(),
  emailConfirmation: {
    isConfirmed: extraDBFields.emailConfirmation.isConfirmed,
    confirmationCode: extraDBFields.emailConfirmation.confirmationCode,
    expirationDate: extraDBFields.emailConfirmation.expirationDate,
  },
});
