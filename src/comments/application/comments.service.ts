import { inject, injectable } from 'inversify';
import { CommentsRepository } from '../repositories/comments.repositories';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { PostsQueryRepository } from '../../posts/repositories/posts-query.repositories';
import { UsersQueryRepository } from '../../users/repositories/users-query.repositories';
import { TCreateCommentByPostIdParams } from './params/create-comment-by-postId.params';
import { LikesRepository } from '../../likes/repositories/likes.repositories';
import { EResultStatus } from '../../core/constants/resultCode';
import { validationMessages } from '../constants/validation';
import { TCommentUpdateLikeStatusInput } from '../routers/input/comment-update-like-status.input';
import { ELikeStatus } from '../../likes/constants/like-status';
import { errorMessages as postErrorMessages } from '../../posts/constants/texts';
import { errorMessages } from '../constants/texts';
import { CommentModel } from '../model/comment.model';
import { LikeModel } from '../../likes/model/like.model';
import { TLikeDocument } from '../../likes/types/like.types';

@injectable()
export class CommentsService {
  constructor(
    @inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @inject(CommentsRepository)
    private commentsRepository: CommentsRepository,
    @inject(LikesRepository) private likesRepository: LikesRepository,
  ) {}

  async createCommentByPostId({
    userId,
    postId,
    dto,
  }: TCreateCommentByPostIdParams) {
    const post = await this.postsQueryRepository.getPostById({
      id: postId,
      userId,
    });
    if (!post) {
      return {
        data: null,
        status: EResultStatus.NotFound,
        extensions: [
          {
            field: null,
            message: postErrorMessages.notFound,
          },
        ],
        errorMessage: postErrorMessages.notFound,
      };
    }

    const user = await this.usersQueryRepository.getUserById(userId);

    const commentDocument = await CommentModel.createCommentInstance({
      userData: { userId, userLogin: user.login },
      postId,
      commentData: dto,
    });

    await this.commentsRepository.saveComment(commentDocument);

    return {
      status: EResultStatus.Success,
      data: { commentId: commentDocument._id.toString() },
      extensions: [],
    };
  }

  async updateCommentById({ userId, commentId, content }: TCommentUpdateInput) {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      return {
        data: null,
        status: EResultStatus.NotFound,
        extensions: [
          {
            field: null,
            message: errorMessages.notFound,
          },
        ],
        errorMessage: errorMessages.notFound,
      };
    }

    if (!comment.isCommentOwner(userId)) {
      return {
        data: null,
        status: EResultStatus.Forbidden,
        extensions: [
          {
            field: null,
            message: validationMessages.noAccess,
          },
        ],
        errorMessage: validationMessages.noAccess,
      };
    }

    const commentDocument = comment.updateComment(content);

    await this.commentsRepository.saveComment(commentDocument);

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async updateCommentLikeStatus({
    userId,
    login,
    commentId,
    likeStatus,
  }: TCommentUpdateLikeStatusInput) {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      return {
        data: null,
        status: EResultStatus.NotFound,
        extensions: [
          {
            field: null,
            message: errorMessages.notFound,
          },
        ],
        errorMessage: errorMessages.notFound,
      };
    }

    const parentId = comment._id.toString();

    const like = await this.likesRepository.findLikeByFilter({
      parentId,
      authorId: userId,
    });

    if (!like) {
      if (likeStatus === ELikeStatus.None) {
        return {
          status: EResultStatus.Success,
          data: null,
          extensions: [],
        };
      }

      const likeDocument = await LikeModel.createLikeInstance({
        authorId: userId,
        login,
        parentId,
        likeStatus,
      });

      const commentDocument =
        comment.updateCommentLikesByIncomingLikeStatus(likeStatus);

      await this.likesRepository.saveLike(likeDocument);
      await this.commentsRepository.saveComment(commentDocument);

      return {
        status: EResultStatus.Success,
        data: null,
        extensions: [],
      };
    }

    if (likeStatus === like.status) {
      return {
        status: EResultStatus.Success,
        data: null,
        extensions: [],
      };
    }

    const commentDocument =
      comment.updateCommentLikesByIncomingLikeStatusAndLike({
        like: like as unknown as TLikeDocument,
        likeStatus,
      });

    const likeDocument = like.updateLikeStatus(likeStatus);

    await this.likesRepository.saveLike(likeDocument);
    await this.commentsRepository.saveComment(commentDocument);

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async delete({ userId, commentId }: { userId: string; commentId: string }) {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      return {
        data: null,
        status: EResultStatus.NotFound,
        extensions: [
          {
            field: null,
            message: errorMessages.notFound,
          },
        ],
        errorMessage: errorMessages.notFound,
      };
    }

    if (!comment.isCommentOwner(userId)) {
      return {
        data: null,
        status: EResultStatus.Forbidden,
        extensions: [
          {
            field: null,
            message: validationMessages.noAccess,
          },
        ],
        errorMessage: validationMessages.noAccess,
      };
    }

    const isDeleted = await this.commentsRepository.delete(commentId);
    if (isDeleted) {
      return {
        status: EResultStatus.Success,
        data: null,
        extensions: [],
      };
    }

    return {
      data: null,
      status: EResultStatus.NotFound,
      extensions: [
        {
          field: null,
          message: postErrorMessages.notFound,
        },
      ],
      errorMessage: postErrorMessages.notFound,
    };
  }
}
