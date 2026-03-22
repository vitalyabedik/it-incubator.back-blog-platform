import { injectable } from 'inversify';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { errorMessages } from '../constants/texts';
import { TBlogQueryInput } from '../routers/input/blog-query.input';
import { createBlogFilter } from './utils/create-blog-filter';
import { TBlogListPaginatedOutput } from './output/blog-list-paginated.output';
import { TBlogOutput } from './output/blog.output';
import { mapToBlogListPaginatedOutput } from './mappers/map-to-blog-list-paginated-output.util.ts';
import { mapToBlogOutput } from './mappers/map-to-blog-output.util';
import { BlogModel } from '../model/blog.model';

@injectable()
export class BlogsQueryRepository {
  constructor() {}

  async getBlogList(
    queryDto: TBlogQueryInput,
  ): Promise<TBlogListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);
    const filter = createBlogFilter(queryDto);

    const [items, totalCount] = await Promise.all([
      BlogModel.find(filter).lean().sort(sort).skip(skip).limit(limit).exec(),
      BlogModel.countDocuments(filter).exec(),
    ]);

    const blogListOutput = mapToBlogListPaginatedOutput(items, {
      pagination: {
        page: queryDto.pageNumber,
        pageSize: queryDto.pageSize,
        totalCount,
      },
    });

    return blogListOutput;
  }

  async getBlogById(id: string): Promise<TBlogOutput> {
    const res = await BlogModel.findById(id).lean().exec();

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    const blogOutput = mapToBlogOutput(res);

    return blogOutput;
  }
}
