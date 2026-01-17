import request from 'supertest';
import { Express } from 'express';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TBlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { TPostOutput } from '../../../src/posts/routers/output/post.output';
import { TPostCreateInput } from '../../../src/posts/routers/input/post-create.input';
import { getPostDto } from '../posts/get-post-dto';

type TCreatePostByBlogIdArgs = {
  app: Express;
  authToken: string;
  blogOutput: TBlogOutput;
  postDto?: TPostCreateInput;
};

export const createPostByBlogId = async ({
  app,
  authToken,
  blogOutput,
  postDto,
}: TCreatePostByBlogIdArgs): Promise<TPostOutput> => {
  const defaultPostData: TPostCreateInput = await getPostDto(blogOutput.id);

  const testPostData: TPostCreateInput = {
    ...defaultPostData,
    ...postDto,
  };

  const createdPostResponse = await request(app)
    .post(`${BLOGS_PATH}/${testPostData.blogId}/posts`)
    .set('Authorization', authToken)
    .send(testPostData)
    .expect(EHttpStatus.CREATED_201);

  return createdPostResponse.body;
};
