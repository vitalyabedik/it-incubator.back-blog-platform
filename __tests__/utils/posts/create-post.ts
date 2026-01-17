import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TPostInputDto } from '../../../src/posts/dto/posts.input-dto';
import { TBlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { TPostViewModel } from '../../../src/posts/types';
import { getPostDto } from './get-post-dto';

type TCreatePostArgs = {
  app: Express;
  authToken: string;
  blogOutput: TBlogOutput;
  postDto?: TPostInputDto;
};

export const createPost = async ({
  app,
  authToken,
  blogOutput,
  postDto,
}: TCreatePostArgs): Promise<TPostViewModel> => {
  const defaultPostData: TPostInputDto = await getPostDto(blogOutput.id);

  const testPostData = {
    ...defaultPostData,
    ...postDto,
    blogName: blogOutput.name,
  };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', authToken)
    .send(testPostData)
    .expect(EHttpStatus.CREATED_201);

  return createdPostResponse.body;
};
