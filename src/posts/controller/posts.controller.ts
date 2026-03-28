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
import { EResultStatus } from '../../core/constants/resultCode';
import { resultCodeToHttpException } from '../../core/utils/resultCodeToHttpException';
import { TPostUpdateLikeStatusInput } from '../routers/input/post-update-like-status.input';
import { TUpdatePostLikeStatusParams } from './params/update-post-like-status-params';

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
    const userId =
      (await getUserIdFromAccessToken(req.headers.authorization)) || undefined;

    const sanitizedQuery = matchedData<TPostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput = setDefaultSortAndPagination(sanitizedQuery);

    const postList = await this.postsQueryRepository.getPostList(
      queryInput,
      userId,
    );

    res.send(postList);
  }

  async getPost(req: TRequestWithParams<TGetPostParams>, res: Response) {
    const userId =
      (await getUserIdFromAccessToken(req.headers.authorization)) || undefined;

    const post = await this.postsQueryRepository.getPostById({
      id: req.params.id,
      userId,
    });
    if (!post) return res.sendStatus(EHttpStatus.NOT_FOUND_404);

    res.send(post);
  }

  async createPost(req: TRequestWithBody<TPostCreateInput>, res: Response) {
    const result = await this.postsService.create(req.body);
    const userId =
      (await getUserIdFromAccessToken(req.headers.authorization)) || undefined;

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    const post = await this.postsQueryRepository.getPostById({
      id: result.data.id,
      userId,
    });

    res.status(EHttpStatus.CREATED_201).send(post);
  }

  async updatePost(
    req: TRequestWithParamsAndBody<TDeletePostParams, TPostUpdateInput>,
    res: Response,
  ) {
    const postId = req.params.id;
    const postData = req.body;

    const result = await this.postsService.update(postId, postData);

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async deletePost(req: TRequestWithParams<TDeletePostParams>, res: Response) {
    const result = await this.postsService.delete(req.params.id);

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }

  async getCommentListByPostId(
    req: TRequestWithParamsAndQuery<
      TGetCommentListByPostIdParams,
      TCommentListQueryInput
    >,
    res: Response,
  ) {
    const postId = req.params.id;
    const userId =
      (await getUserIdFromAccessToken(req.headers.authorization)) || undefined;

    const query = matchedData<TCommentListQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const post = await this.postsQueryRepository.getPostById({
      id: postId,
      userId,
    });
    if (!post) return res.sendStatus(EHttpStatus.NOT_FOUND_404);

    const commentList =
      await this.commentsQueryRepository.getCommentListByPostId(
        postId,
        query,
        userId,
      );

    res.send(commentList);
  }

  async createCommentByPostId(
    req: TRequestWithParamsAndBody<
      TCreateCommentByPostIdParams,
      TCommentCreateInput
    >,
    res: Response,
  ) {
    const userId = req.user?.id!;

    const result = await this.commentsService.createCommentByPostId({
      userId,
      postId: req.params.id,
      dto: req.body,
    });

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    const createdComment = await this.commentsQueryRepository.getCommentById({
      commentId: result.data!.commentId,
      userId,
    });

    res.status(EHttpStatus.CREATED_201).send(createdComment);
  }

  async updatePostLikeStatus(
    req: TRequestWithParamsAndBody<
      TUpdatePostLikeStatusParams,
      TPostUpdateLikeStatusInput
    >,
    res: Response,
  ) {
    const userId = req.user?.id!;
    const login = req.login!;
    const postId = req.params.id;
    const likeStatus = req.body.likeStatus;

    const result = await this.postsService.updatePostLikeStatus({
      userId,
      login,
      postId,
      likeStatus,
    });

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(EHttpStatus.NO_CONTENT_204);
  }
}
