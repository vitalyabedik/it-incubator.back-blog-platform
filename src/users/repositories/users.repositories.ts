import { ObjectId } from 'mongodb';
import { userCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { TUserDB } from '../domain/userDB';
import { TUserRepositoryOutput } from './output/user-repository.output';

export const usersRepository = {
  async create(newUser: TUserDB): Promise<string> {
    const insertResult = await userCollection.insertOne(newUser);

    return insertResult.insertedId.toString();
  },

  async updateUserById(id: string, updatedUser: TUserDB): Promise<boolean> {
    const { modifiedCount } = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser },
    );

    return modifiedCount > 0;
  },

  async updateUserPasswordByUserId(id: string, passwordHash: string) {
    const { modifiedCount } = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { passwordHash }, $unset: { passwordRecovery: '' } },
    );

    return modifiedCount > 0;
  },

  async delete(id: string): Promise<void> {
    const { deletedCount } = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },

  async findUserById(id: string): Promise<TUserRepositoryOutput | null> {
    return await userCollection.findOne({ _id: new ObjectId(id) });
  },

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<TUserRepositoryOutput | null> {
    return await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },

  async findUserByConfirmationCode(
    code: string,
  ): Promise<TUserRepositoryOutput | null> {
    return await userCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  },

  async findUserByRecoveryCode(
    code: string,
  ): Promise<TUserRepositoryOutput | null> {
    return await userCollection.findOne({
      'passwordRecovery.recoveryCode': code,
    });
  },
};
