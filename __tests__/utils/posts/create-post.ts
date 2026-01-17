import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TBlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { TPostOutput } from '../../../src/posts/routers/output/post.output';
import { TPostCreateInput } from '../../../src/posts/routers/input/post-create.input';
import { getPostDto } from './get-post-dto';

type TCreatePostArgs = {
  app: Express;
  authToken: string;
  blogOutput: TBlogOutput;
  postDto?: TPostCreateInput;
};

export const createPost = async ({
  app,
  authToken,
  blogOutput,
  postDto,
}: TCreatePostArgs): Promise<TPostOutput> => {
  const defaultPostData: TPostCreateInput = await getPostDto(blogOutput.id);

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
