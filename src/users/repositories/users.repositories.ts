import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { UserModel } from '../model/user.model';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { TUserDocument } from '../types/user.types';

@injectable()
export class UsersRepository {
  constructor() {}

  async delete(id: string): Promise<void> {
    const { deletedCount } = await UserModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }
  }

  async findUserById(id: string): Promise<TUserDocument | null> {
    return UserModel.findById(id).exec();
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<TUserDocument | null> {
    return UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).exec();
  }

  async findUserByConfirmationCode(
    code: string,
  ): Promise<TUserDocument | null> {
    return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
  }

  async findUserByRecoveryCode(code: string): Promise<TUserDocument | null> {
    return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
  }

  async saveUser(user: TUserDocument) {
    await user.save();
  }
}
