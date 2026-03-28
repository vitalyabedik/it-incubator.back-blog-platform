import { inject, injectable } from 'inversify';
import { BcryptService } from '../../auth/adapters/bcrypt.service';
import { TUserCreateRequestInput } from '../routes/input/user-create.input';
import { UsersRepository } from '../repositories/users.repositories';
import { UserModel } from '../model/user.model';

@injectable()
export class UsersService {
  constructor(
    @inject(BcryptService) private bcryptService: BcryptService,
    @inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async create(
    dto: TUserCreateRequestInput,
  ): Promise<string | { isExist: true; byField: 'login' | 'email' }> {
    const { login, email, password } = dto;

    const checkInputUser = await UserModel.checkIsUserExist(dto);
    if (checkInputUser.isExist) return checkInputUser;

    const passwordHash = await this.bcryptService.generateHash(password);

    const userDocument = await UserModel.createUserInstance({
      login,
      email,
      passwordHash,
    });

    await this.usersRepository.saveUser(userDocument);

    return userDocument._id.toString();
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
