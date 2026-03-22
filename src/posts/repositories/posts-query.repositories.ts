import { injectable } from 'inversify';
import { TPostQueryInput } from '../routers/input/post-query.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { errorMessages } from '../constants/texts';
import { TPostOutput } from './output/post.output';
import { TPostListPaginatedOutput } from './output/post-list-paginated.output';
import { mapToPostListPaginatedOutput } from './mappers/map-to-post-list-paginated-output.util copy';
import { mapToPostOutput } from './mappers/map-to-post-output.util';
import { PostModel } from '../model/post.model';

@injectable()
export class PostsQueryRepository {
  constructor() {}

  async getPostList(
    queryDto: TPostQueryInput,
  ): Promise<TPostListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);

    const [items, totalCount] = await Promise.all([
      PostModel.find().lean().sort(sort).skip(skip).limit(limit),
      PostModel.countDocuments(),
    ]);

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pagination: {
        page: queryDto.pageNumber,
        pageSize: queryDto.pageSize,
        totalCount,
      },
    });

    return postListOutput;
  }

  async getPostListByBlogId(
    blogId: string,
    queryDto: TPostQueryInput,
  ): Promise<TPostListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);

    const [items, totalCount] = await Promise.all([
      PostModel.find({ blogId }).lean().sort(sort).skip(skip).limit(limit),
      PostModel.countDocuments({ blogId }),
    ]);

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pagination: {
        page: queryDto.pageNumber,
        pageSize: queryDto.pageSize,
        totalCount,
      },
    });

    return postListOutput;
  }

  async getPostById(id: string): Promise<TPostOutput> {
    const res = await PostModel.findById(id).lean().exec();

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    const postOutput = mapToPostOutput(res);

    return postOutput;
  }
}
