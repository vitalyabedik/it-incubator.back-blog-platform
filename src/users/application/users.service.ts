import { bcryptService } from '../../auth/adapters/bcrypt.service';
import { TAPIErrorResult } from '../../core/types/error';
import { TUserCreateInput } from '../routes/input/user-create.input';
import { usersRepository } from '../repositories/users.repositories';
import { checkIsUniqueLoginAndEmail } from '../repositories/validation/user.repositories-unique-loginAndEmail.validation';
import { mapToDbUser } from '../repositories/mappers/map-to-db-user';

export const usersService = {
  async create(dto: TUserCreateInput): Promise<string | TAPIErrorResult> {
    const { login, email, password } = dto;

    const isUniquerOrError = await checkIsUniqueLoginAndEmail(login, email);
    if (typeof isUniquerOrError !== 'boolean') return isUniquerOrError;

    const passwordHash = await bcryptService.generateHash(password);

    const newDbUser = mapToDbUser(dto, passwordHash);

    return usersRepository.create(newDbUser);
  },

  async delete(id: string): Promise<void> {
    await usersRepository.delete(id);
    return;
  },
};
