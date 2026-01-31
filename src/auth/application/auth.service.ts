import { TUserRepositoryOutput } from './../../users/repositories/output/user-repository.output';
import { usersRepository } from '../../users/repositories/users.repositories';
import { bcryptService } from '../adapters/bcrypt.service';
import { jwtService } from '../adapters/jwt.service';
import { TAuthLoginInput } from '../routers/input/auth-login.input';

export const authService = {
  async loginUser(
    loginDto: TAuthLoginInput,
  ): Promise<{ accessToken: string } | null> {
    const user = await this._checkUserCredentials(loginDto);
    if (!user) return null;

    const accessToken = await jwtService.createToken({
      userId: user._id.toString(),
    });

    return { accessToken };
  },

  async _checkUserCredentials(
    loginDto: TAuthLoginInput,
  ): Promise<TUserRepositoryOutput | null> {
    const { loginOrEmail, password } = loginDto;

    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const isPassCorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPassCorrect) return null;

    return user;
  },
};
