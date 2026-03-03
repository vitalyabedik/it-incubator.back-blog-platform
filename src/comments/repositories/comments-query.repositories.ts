import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { commentCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { getPaginationParams } from '../../core/utils/getPaginationParams';
import { errorMessages } from '../constants/texts';
import { TCommentQueryInput } from '../routers/input/comment-query.input';
import { TCommentListPaginatedOutput } from './output/comment-list-paginated.output';
import { TCommentOutput } from './output/comment.output';
import { mapToCommentListPaginatedOutput } from './mappers/map-to-comment-list-paginated-output.util.ts';
import { mapToCommentOutput } from './mappers/map-to-comment-output.util';

@injectable()
export class CommentsQueryRepository {
  constructor() {}

  async getCommentById(id: string): Promise<TCommentOutput> {
    const res = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError(errorMessages.noExist);
    }

    const commentOutput = mapToCommentOutput(res);

    return commentOutput;
  }

  async getCommentListByPostId(
    postId: string,
    queryDto: TCommentQueryInput,
  ): Promise<TCommentListPaginatedOutput> {
    const { sort, skip, limit } = getPaginationParams(queryDto);
    const filter = { postId };

    const items = await commentCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await commentCollection.countDocuments(filter);

    const commentListOutput = mapToCommentListPaginatedOutput(items, {
      pagination: {
        page: queryDto.pageNumber,
        pageSize: queryDto.pageSize,
        totalCount,
      },
    });

    return commentListOutput;
  }
}
