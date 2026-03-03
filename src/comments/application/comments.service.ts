import { inject, injectable } from 'inversify';
import { CommentsRepository } from '../repositories/comments.repositories';
import { TCommentUpdateInput } from '../routers/input/comment-update.input';
import { PostsQueryRepository } from '../../posts/repositories/posts-query.repositories';
import { UsersQueryRepository } from '../../users/repositories/users-query.repositories';
import { mapToDbComment } from '../repositories/mappers/map-to-db-comment.util';
import { TCreateCommentByPostIdParams } from './params/create-comment-by-postId.params';

@injectable()
export class CommentsService {
  constructor(
    @inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @inject(CommentsRepository)
    private commentsRepository: CommentsRepository,
  ) {}

  async update(id: string, dto: TCommentUpdateInput): Promise<void> {
    await this.commentsRepository.update(id, dto);
    return;
  }

  async delete(id: string): Promise<void> {
    await this.commentsRepository.delete(id);
    return;
  }

  async createCommentByPostId({
    userId,
    postId,
    dto,
  }: TCreateCommentByPostIdParams): Promise<string> {
    await this.postsQueryRepository.getPostById(postId);

    const user = await this.usersQueryRepository.getUserById(userId);

    const newDbComment = mapToDbComment({ user, postId, dto });

    return this.commentsRepository.create(newDbComment);
  }
}
