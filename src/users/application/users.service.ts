import { inject, injectable } from 'inversify';
import { BcryptService } from '../../auth/adapters/bcrypt.service';
import { TAPIErrorResult } from '../../core/types/error';
import { TUserCreateInput } from '../routes/input/user-create.input';
import { UsersRepository } from '../repositories/users.repositories';
import { checkIsUniqueLoginAndEmail } from '../repositories/validation/user.repositories-unique-loginAndEmail.validation';
import { mapToDbUser } from '../repositories/mappers/map-to-db-user.util';

@injectable()
export class UsersService {
  constructor(
    @inject(BcryptService) private bcryptService: BcryptService,
    @inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async create(dto: TUserCreateInput): Promise<string | TAPIErrorResult> {
    const { login, email, password } = dto;

    const isUniquerOrError = await checkIsUniqueLoginAndEmail({
      usersRepository: this.usersRepository,
      login,
      email,
    });
    if (typeof isUniquerOrError !== 'boolean') return isUniquerOrError;

    const passwordHash = await this.bcryptService.generateHash(password);

    const newDbUser = mapToDbUser({
      userDto: dto,
      extraDBFields: {
        passwordHash,
        emailConfirmation: {
          isConfirmed: true,
          confirmationCode: '',
          expirationDate: null,
        },
      },
    });

    return this.usersRepository.create(newDbUser);
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
