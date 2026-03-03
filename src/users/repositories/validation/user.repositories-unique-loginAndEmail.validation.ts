import { TAPIErrorResult } from '../../../core/types/error';
import { createErrorMessages } from '../../../core/utils/errors';
import { EUserValidationField } from '../../constants/errors';
import { errorMessages } from '../../constants/texts';
import { UsersRepository } from '../users.repositories';

type TArgs = {
  usersRepository: UsersRepository;
  login: string;
  email: string;
};

export const checkIsUniqueLoginAndEmail = async ({
  usersRepository,
  login,
  email,
}: TArgs): Promise<TAPIErrorResult | boolean> => {
  const dbLoginOrNull = await usersRepository.findUserByLoginOrEmail(login);
  if (dbLoginOrNull)
    return createErrorMessages([
      {
        field: EUserValidationField.LOGIN,
        message: errorMessages.uniqueLogin,
      },
    ]);

  const dbEmailOrNull = await usersRepository.findUserByLoginOrEmail(email);
  if (dbEmailOrNull)
    return createErrorMessages([
      {
        field: EUserValidationField.EMAIL,
        message: errorMessages.uniqueEmail,
      },
    ]);

  return true;
};
