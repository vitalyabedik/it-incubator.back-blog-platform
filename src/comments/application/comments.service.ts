import { commentsRepository } from '../repositories/comments.repositories';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { postsQueryRepository } from '../../posts/repositories/posts-query.repositories';
import { usersQueryRepository } from '../../users/repositories/users-query.repositories';
import { mapToDbComment } from '../repositories/mappers/map-to-db-comment.util';
import { TCreateCommentByPostIdParams } from './params/create-comment-by-postId.params';

export const commentsService = {
  async update(id: string, dto: TCommentUpdateInput): Promise<void> {
    await commentsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await commentsRepository.delete(id);
    return;
  },

  async createCommentByPostId({
    userId,
    postId,
    dto,
  }: TCreateCommentByPostIdParams): Promise<string> {
    await postsQueryRepository.getPostById(postId);

    const user = await usersQueryRepository.getUserById(userId);

    const newDbComment = mapToDbComment({ user, postId, dto });

    return commentsRepository.create(newDbComment);
  },
};
