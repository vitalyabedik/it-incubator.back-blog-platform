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

  async delete(id: string): Promise<void> {
    const { deletedCount } = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },

  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<TUserRepositoryOutput | null> {
    return await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },
};
