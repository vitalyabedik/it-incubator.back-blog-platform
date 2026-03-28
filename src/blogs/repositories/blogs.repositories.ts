import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { errorMessages } from '../constants/texts';
import { BlogModel } from '../model/blog.model';
import { TBlogDocument } from '../types/blog.types';

@injectable()
export class BlogsRepository {
  constructor() {}

  async findBlogById(id: string) {
    const blog = await BlogModel.findById(id).exec();
    if (!blog) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    return blog;
  }

  async delete(id: string): Promise<void> {
    const { deletedCount } = await BlogModel.deleteOne({
      _id: new Types.ObjectId(id),
    }).exec();

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }
  }

  async saveBlog(blogDocument: TBlogDocument) {
    await blogDocument.save();
  }
}
