import { inject, injectable } from 'inversify';
import { CommentsRepository } from '../repositories/comments.repositories';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { PostsQueryRepository } from '../../posts/repositories/posts-query.repositories';
import { UsersQueryRepository } from '../../users/repositories/users-query.repositories';
import { mapToDbComment } from '../repositories/mappers/map-to-db-comment.util';
import { TCreateCommentByPostIdParams } from './params/create-comment-by-postId.params';
import { LikesRepository } from '../../likes/repositories/likes.repositories';
import { EResultStatus } from '../../core/constants/resultCode';
import { validationMessages } from '../constants/validation';
import { TCommentUpdateLikeStatusInput } from '../routers/input/comment-update-like-status.input';
import { ELikeStatus } from '../../likes/constants/like-status';
import { mapToDbLike } from '../../likes/mappers/map-to-db-like.util';
import { errorMessages as postErrorMessages } from '../../posts/constants/texts';
import { errorMessages } from '../constants/texts';

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
    await this.postsQueryRepository.getPostById(postId);

    const user = await this.usersQueryRepository.getUserById(userId);

    const newDbComment = mapToDbComment({ user, postId, dto });

    const commentId = await this.commentsRepository.create(newDbComment);

    return {
      status: EResultStatus.Success,
      data: { commentId },
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

    if (comment.commentatorInfo.userId !== userId) {
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

    comment.content = content;

    await this.commentsRepository.saveComment(comment);

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async updateCommentLikeStatus({
    userId,
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

    const parentId = comment.id;

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

      const newDbLike = mapToDbLike({ userId, parentId, likeStatus });

      if (likeStatus === ELikeStatus.Like) {
        comment.likesInfo.likesCount += 1;
      }

      if (likeStatus === ELikeStatus.Dislike) {
        comment.likesInfo.dislikesCount += 1;
      }

      await this.likesRepository.createLike(newDbLike);
      await this.commentsRepository.saveComment(comment);

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

    if (like.status === ELikeStatus.Like) {
      if (likeStatus === ELikeStatus.Dislike) {
        comment.likesInfo.dislikesCount += 1;
        comment.likesInfo.likesCount -= 1;
      }

      if (likeStatus === ELikeStatus.None) {
        comment.likesInfo.likesCount -= 1;
      }
    }

    if (like.status === ELikeStatus.Dislike) {
      if (likeStatus === ELikeStatus.Like) {
        comment.likesInfo.likesCount += 1;
        comment.likesInfo.dislikesCount -= 1;
      }

      if (likeStatus === ELikeStatus.None) {
        comment.likesInfo.dislikesCount -= 1;
      }
    }

    if (like.status === ELikeStatus.None) {
      if (likeStatus === ELikeStatus.Like) {
        comment.likesInfo.likesCount += 1;
      }

      if (likeStatus === ELikeStatus.Dislike) {
        comment.likesInfo.dislikesCount += 1;
      }
    }

    comment.likesInfo.likesCount = Math.max(0, comment.likesInfo.likesCount);
    comment.likesInfo.dislikesCount = Math.max(
      0,
      comment.likesInfo.dislikesCount,
    );
    like.status = likeStatus;

    await this.likesRepository.save(like);
    await this.commentsRepository.saveComment(comment);

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

    if (comment.commentatorInfo.userId !== userId) {
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
