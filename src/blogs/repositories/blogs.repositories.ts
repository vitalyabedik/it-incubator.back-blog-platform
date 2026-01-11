import { ObjectId, WithId } from 'mongodb';
import { blogCollection } from '../../db/mongo.db';
import { TBlogInputDto } from '../dto/blogs.input-dto';
import { TBlog } from '../types';

export const blogsRepository = {
  async findAll(): Promise<WithId<TBlog>[]> {
    return blogCollection.find().toArray();
  },
  async findById(id: string): Promise<WithId<TBlog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(newBlog: TBlog): Promise<WithId<TBlog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return { ...newBlog, _id: insertResult.insertedId };
  },
  async update(id: string, dto: TBlogInputDto): Promise<void> {
    const { name, description, websiteUrl } = dto;

    await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          websiteUrl,
        },
      },
    );
    return;
  },
  async delete(id: string): Promise<void> {
    await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return;
  },
};
