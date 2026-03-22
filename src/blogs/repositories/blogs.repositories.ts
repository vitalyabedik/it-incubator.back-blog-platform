import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { BlogModel, TBlog, TBlogDocument } from '../model/blog.model';

@injectable()
export class BlogsRepository {
  constructor() {}

  async findBlogById(id: string) {
    const res = await BlogModel.findById(id);
    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return res;
  }

  async create(newDbBlog: Omit<TBlog, '_id'>): Promise<string> {
    const { id } = await BlogModel.create(newDbBlog);

    return id;
  }

  async delete(id: string): Promise<void> {
    const { deletedCount } = await BlogModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }
  }

  async saveBlog(blogDocument: TBlogDocument) {
    await blogDocument.save();
  }
}
