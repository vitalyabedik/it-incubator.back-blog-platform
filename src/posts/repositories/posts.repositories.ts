import { ObjectId } from 'mongodb';
import { TPost } from '../domain/post';
import { TPostUpdateInput } from '../routers/input/post-update.input';
import { postCollection } from '../../db/mongo.db';
import { TPostListRepositoryOutput } from './output/post-list-repository.output';
import { TPostQueryInput } from '../routers/input/post-query.input';
import { TPostRepositoryOutput } from './output/post-repository.output';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';

export const postsRepository = {
  async getPostList(
    queryDto: TPostQueryInput,
  ): Promise<TPostListRepositoryOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments();

    return { items, totalCount };
  },

  async getPostById(id: string): Promise<TPostRepositoryOutput> {
    const res = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return res;
  },

  async create(newPost: TPost): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: TPostUpdateInput): Promise<void> {
    const { blogId, content, shortDescription, title } = dto;

    const { modifiedCount } = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          blogId,
          content,
          shortDescription,
          title,
        },
      },
    );

    if (modifiedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const { deletedCount } = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return;
  },
};
