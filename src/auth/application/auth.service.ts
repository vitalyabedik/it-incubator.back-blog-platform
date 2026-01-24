import { usersRepository } from '../../users/repositories/users.repositories';
import { bcryptService } from '../adapters/bcrypt.service';
import { TAuthLoginInput } from '../routers/input/auth-login.input';

export const authService = {
  async loginUser(
    loginDto: TAuthLoginInput,
  ): Promise<{ accessToken: string } | null> {
    const isCorrectCredentials = await this._checkUserCredentials(loginDto);
    if (!isCorrectCredentials) return null;

    return { accessToken: 'token' };
  },

  async _checkUserCredentials(loginDto: TAuthLoginInput): Promise<boolean> {
    const { loginOrEmail, password } = loginDto;

    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;

    return bcryptService.checkPassword(password, user.passwordHash);
  },
};
