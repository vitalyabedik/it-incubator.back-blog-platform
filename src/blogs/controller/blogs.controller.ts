import { Response } from 'express';
import { inject, injectable } from 'inversify';
import {
  TRequestWithBody,
  TRequestWithParams,
  TRequestWithParamsAndBody,
  TRequestWithParamsAndQuery,
  TRequestWithQuery,
} from '../../core/types/request';
import { errorsHandler } from '../../core/errors/errors.handler';
import { EHttpStatus } from '../../core/constants/http';
import { matchedData } from 'express-validator';
import { TPostQueryInput } from '../../posts/routers/input/post-query.input';
import { TGetPostListByBlogIdParams } from './params/get-post-list-by-blogId-params';
import { BlogsQueryRepository } from '../repositories/blogs-query.repositories';
import { TBlogQueryInput } from '../routers/input/blog-query.input';
import { setDefaultSortAndPagination } from '../../core/utils/set-default-sort-and-pagination';
import { setDefaultBlogFilters } from './utils/set-default-blog-filters';
import { TGetBlogParams } from './params/get-blog-params';
import { TBlogCreateInput } from '../routers/input/blog-create.input';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { TCreatePostByBlogIdParams } from './params/create-post-by-blogId-params';
import { TPostCreateInput } from '../../posts/routers/input/post-create.input';
import { PostsQueryRepository } from '../../posts/repositories/posts-query.repositories';
import { TUpdateBlogParams } from './params/update-blog-params';
import { TBlogUpdateInput } from '../routers/input/blog-update.input';
import { TDeleteBlogParams } from './params/delete-blog-params';
import { EResultStatus } from '../../core/constants/resultCode';
import { resultCodeToHttpException } from '../../core/utils/resultCodeToHttpException';
import { getUserIdFromAccessToken } from '../../core/utils/get-user-id-from-access-token';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService)
    private blogsService: BlogsService,
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsService)
    private postsService: PostsService,
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async getBlogList(req: TRequestWithQuery<TBlogQueryInput>, res: Response) {
    try {
      const { searchNameTerm, ...restPaginationAndSort } =
        matchedData<TBlogQueryInput>(req, {
          locations: ['query'],
          includeOptionals: true,
        });
      const queryInput = {
        ...setDefaultSortAndPagination(restPaginationAndSort),
        ...setDefaultBlogFilters({ searchNameTerm }),
      };

      const blogList = await this.blogsQueryRepository.getBlogList(queryInput);

      res.send(blogList);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async getBlog(req: TRequestWithParams<TGetBlogParams>, res: Response) {
    try {
      const blog = await this.blogsQueryRepository.getBlogById(req.params.id);

      res.send(blog);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async createBlog(req: TRequestWithBody<TBlogCreateInput>, res: Response) {
    try {
      const createdBlogId = await this.blogsService.create(req.body);

      const createdBlog =
        await this.blogsQueryRepository.getBlogById(createdBlogId);

      res.status(EHttpStatus.CREATED_201).send(createdBlog);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async updateBlog(
    req: TRequestWithParamsAndBody<TUpdateBlogParams, TBlogUpdateInput>,
    res: Response,
  ) {
    try {
      await this.blogsService.update(req.params.id, req.body);

      res.sendStatus(EHttpStatus.NO_CONTENT_204);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async deleteBlog(req: TRequestWithParams<TDeleteBlogParams>, res: Response) {
    try {
      await this.blogsService.delete(req.params.id);

      res.sendStatus(EHttpStatus.NO_CONTENT_204);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async getPostListByBlogId(
    req: TRequestWithParamsAndQuery<
      TGetPostListByBlogIdParams,
      TPostQueryInput
    >,
    res: Response,
  ) {
    try {
      const userId =
        (await getUserIdFromAccessToken(req.headers.authorization)) ||
        undefined;
      const blogId = req.params.id;

      const query = matchedData<TPostQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
      });

      const blog = await this.blogsQueryRepository.getBlogById(blogId);
      if (!blog) return res.sendStatus(EHttpStatus.NOT_FOUND_404);

      const postList = await this.postsQueryRepository.getPostListByBlogId(
        blogId,
        query,
        userId,
      );

      res.send(postList);
    } catch (error: unknown) {
      errorsHandler(error, res);
    }
  }

  async createPostByBlogId(
    req: TRequestWithParamsAndBody<TCreatePostByBlogIdParams, TPostCreateInput>,
    res: Response,
  ) {
    const blogId = req.params.id;
    const userId = req.user?.id || undefined;

    const result = await this.postsService.create({
      ...req.body,
      blogId,
    });

    if (result.status !== EResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    const createdPost = await this.postsQueryRepository.getPostById({
      id: result.data!.id,
      userId,
    });

    res.status(EHttpStatus.CREATED_201).send(createdPost);
  }
}
