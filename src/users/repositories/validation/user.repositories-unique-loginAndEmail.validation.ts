import { TAPIErrorResult } from '../../../core/types/error';
import { createErrorMessages } from '../../../core/utils/errors';
import { EUserValidationField } from '../../constants/errors';
import { errorMessages } from '../../constants/texts';
import { usersRepository } from '../users.repositories';

export const checkIsUniqueLoginAndEmail = async (
  login: string,
  email: string,
): Promise<TAPIErrorResult | boolean> => {
  const dbLoginOrNull = await usersRepository.findByLoginOrEmail(login);
  if (dbLoginOrNull)
    return createErrorMessages([
      {
        field: EUserValidationField.LOGIN,
        message: errorMessages.uniqueLogin,
      },
    ]);

  const dbEmailOrNull = await usersRepository.findByLoginOrEmail(email);
  if (dbEmailOrNull)
    return createErrorMessages([
      {
        field: EUserValidationField.EMAIL,
        message: errorMessages.uniqueEmail,
      },
    ]);

  return true;
};
