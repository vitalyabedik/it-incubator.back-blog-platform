import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { matchedData } from 'express-validator';
import {
  TRequestWithBody,
  TRequestWithParams,
  TRequestWithParamsAndBody,
  TRequestWithParamsAndQuery,
  TRequestWithQuery,
} from '../../core/types/request';
import { setDefaultSortAndPagination } from '../../core/utils/set-default-sort-and-pagination';
import { EHttpStatus } from '../../core/constants/http';
import { errorsHandler } from '../../core/errors/errors.handler';
import { CommentsQueryRepository } from '../../comments/repositories/comments-query.repositories';
import { TCommentListQueryInput } from '../../comments/routers/input/comment-list-query.input';
import { TPostQueryInput } from '../routers/input/post-query.input';
import { PostsQueryRepository } from '../repositories/posts-query.repositories';
import { TGetCommentListByPostIdParams } from './params/get-comment-list-by-postId-params';
import { TGetPostParams } from './params/get-post-params';
import { TPostCreateInput } from '../routers/input/post-create.input';
import { PostsService } from '../application/posts.service';
import { TCreateCommentByPostIdParams } from './params/create-comment-by-postId-params';
import { TCommentCreateInput } from '../../comments/routers/input/comment-create.input';
import { CommentsService } from '../../comments/application/comments.service';
import { TDeletePostParams } from './params/delete-post-params';
import { TPostUpdateInput } from '../routers/input/post-update.input';
import { getUserIdFromAccessToken } from '../../core/utils/get-user-id-from-access-token';

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService)
    private postsService: PostsService,
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @inject(CommentsService)
    private commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async getPostList(req: TRequestWithQuery<TPostQueryInput>, res: Response) {
    try {
      const sanitizedQuery = matchedData<TPostQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
      });
      const queryInput = setDefaultSortAndPagination(sanitizedQuery);

      const postList = await this.postsQueryRepository.getPostList(queryInput);

      res.send(postList);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async getPost(req: TRequestWithParams<TGetPostParams>, res: Response) {
    try {
      const post = await this.postsQueryRepository.getPostById(req.params.id);

      res.send(post);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async createPost(req: TRequestWithBody<TPostCreateInput>, res: Response) {
    try {
      const createdPostId = await this.postsService.create(req.body);

      const post = await this.postsQueryRepository.getPostById(createdPostId);

      res.status(EHttpStatus.CREATED_201).send(post);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async updatePost(
    req: TRequestWithParamsAndBody<TDeletePostParams, TPostUpdateInput>,
    res: Response,
  ) {
    try {
      await this.postsService.update(req.params.id, req.body);

      res.sendStatus(EHttpStatus.NO_CONTENT_204);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async deletePost(req: TRequestWithParams<TDeletePostParams>, res: Response) {
    try {
      await this.postsService.delete(req.params.id);

      res.sendStatus(EHttpStatus.NO_CONTENT_204);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async getCommentListByPostId(
    req: TRequestWithParamsAndQuery<
      TGetCommentListByPostIdParams,
      TCommentListQueryInput
    >,
    res: Response,
  ) {
    try {
      const postId = req.params.id;
      const userId =
        (await getUserIdFromAccessToken(req.headers.authorization)) ||
        undefined;

      const query = matchedData<TCommentListQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
      });

      const post = await this.postsQueryRepository.getPostById(postId);
      if (!post) return res.sendStatus(EHttpStatus.NOT_FOUND_404);

      const commentList =
        await this.commentsQueryRepository.getCommentListByPostId(
          postId,
          query,
          userId,
        );

      res.send(commentList);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async createCommentByPostId(
    req: TRequestWithParamsAndBody<
      TCreateCommentByPostIdParams,
      TCommentCreateInput
    >,
    res: Response,
  ) {
    try {
      const userId = req.user?.id!;

      const result = await this.commentsService.createCommentByPostId({
        userId,
        postId: req.params.id,
        dto: req.body,
      });

      const createdComment = await this.commentsQueryRepository.getCommentById({
        commentId: result.data.commentId,
        userId,
      });

      res.status(EHttpStatus.CREATED_201).send(createdComment);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }
}
