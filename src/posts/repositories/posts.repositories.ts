import { ObjectId, WithId } from 'mongodb';
import { TPostInputDto } from '../dto/posts.input-dto';
import { TPost } from '../types';
import { postCollection } from '../../db/mongo.db';

export const postsRepository = {
  async findAll(): Promise<WithId<TPost>[]> {
    return postCollection.find().toArray();
  },
  async findById(id: string): Promise<WithId<TPost> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(newPost: TPost): Promise<WithId<TPost>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },
  async update(id: string, dto: TPostInputDto): Promise<void> {
    const { blogId, content, shortDescription, title } = dto;

    await postCollection.updateOne(
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
    return;
  },
  async delete(id: string): Promise<void> {
    await postCollection.deleteOne({ _id: new ObjectId(id) });
    return;
  },
};
