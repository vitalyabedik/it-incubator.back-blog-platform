import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TPostInputDto } from '../../../src/posts/dto/posts.input-dto';
import { TPostView } from '../../../src/posts/types';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getPostDto } from './get-post-dto';
import { TBlogView } from '../../../src/blogs/types';

export const createPost = async (
  app: Express,
  blogView: TBlogView,
  postDto?: TPostInputDto,
): Promise<TPostView> => {
  const defaultPostData: TPostInputDto = await getPostDto(blogView.id);

  const testPostData = {
    ...defaultPostData,
    ...postDto,
    blogName: blogView.name,
  };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(EHttpStatus.Created_201);

  return createdPostResponse.body;
};
