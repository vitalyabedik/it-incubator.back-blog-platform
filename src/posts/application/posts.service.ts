import { inject, injectable } from 'inversify';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs-query.repositories';
import { mapToDbPost } from '../repositories/mappers/map-to-db-post.util';
import { PostsRepository } from '../repositories/posts.repositories';
import { TPostCreateInput } from '../routers/input/post-create.input';
import { TPostUpdateInput } from '../routers/input/post-update.input';

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}

  async create(dto: TPostCreateInput): Promise<string> {
    const { blogId } = dto;

    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    const newDbPost = mapToDbPost({ blogId, blog, dto });

    return this.postsRepository.create(newDbPost);
  }

  async createPostByBlogId(
    blogId: string,
    dto: TPostCreateInput,
  ): Promise<string> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    const newDbPost = mapToDbPost({ blogId, blog, dto });

    const postId = await this.postsRepository.create(newDbPost);

    return postId;
  }

  async update(id: string, dto: TPostUpdateInput): Promise<void> {
    await this.postsRepository.update(id, dto);
    return;
  }

  async delete(id: string): Promise<void> {
    await this.postsRepository.delete(id);
    return;
  }
}
