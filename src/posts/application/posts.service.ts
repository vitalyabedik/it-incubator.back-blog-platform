import { TLikeDocument } from './../../likes/types/like.types';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs-query.repositories';
import { PostsRepository } from '../repositories/posts.repositories';
import { TPostCreateInput } from '../routers/input/post-create.input';
import { TPostUpdateInput } from '../routers/input/post-update.input';
import { PostModel } from '../model/post.model';
import { ELikeStatus } from '../../likes/constants/like-status';
import { LikesRepository } from '../../likes/repositories/likes.repositories';
import { LikeModel } from '../../likes/model/like.model';
import { EResultStatus } from '../../core/constants/resultCode';
import { errorMessages } from '../constants/texts';

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository)
    private postsRepository: PostsRepository,
    @inject(LikesRepository)
    private likesRepository: LikesRepository,
  ) {}

  async create(dto: TPostCreateInput) {
    const { blogId } = dto;

    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    const postDocument = await PostModel.createPostInstance({
      blogName: blog.name,
      postData: dto,
    });

    await this.postsRepository.savePost(postDocument);

    return {
      status: EResultStatus.Success,
      data: { id: postDocument._id.toString() },
      extensions: [],
    };
  }

  async update(id: string, dto: TPostUpdateInput) {
    const post = await this.postsRepository.findPostById(id);
    if (!post) {
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

    const updatedPost = post.updatePost(dto);

    await this.postsRepository.savePost(updatedPost);

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async delete(id: string) {
    const isDeleted = await this.postsRepository.delete(id);

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
          message: errorMessages.notFound,
        },
      ],
      errorMessage: errorMessages.notFound,
    };
  }

  async updatePostLikeStatus({
    userId,
    login,
    postId,
    likeStatus,
  }: {
    userId: string;
    login: string;
    postId: string;
    likeStatus: ELikeStatus;
  }) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) {
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

    const parentId = post._id.toString();

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

      const postDocument = post.updatePostLikesByIncomingLikeStatus(likeStatus);

      await this.likesRepository.saveLike(likeDocument);
      await this.postsRepository.savePost(postDocument);

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

    const postDocument = post.updatePostLikesByIncomingLikeStatusAndLike({
      like: like as unknown as TLikeDocument,
      likeStatus,
    });

    const likeDocument = like.updateLikeStatus(likeStatus);

    await this.likesRepository.saveLike(likeDocument);
    await this.postsRepository.savePost(postDocument);

    return {
      status: EResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
