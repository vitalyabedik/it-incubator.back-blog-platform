import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TPostInputDto } from '../../../src/posts/dto/posts.input-dto';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getPostDto } from './get-post-dto';
import { createBlog } from '../blogs/create-blog';

export const updatePost = async (
  app: Express,
  postId: string,
  postDto?: TPostInputDto,
): Promise<void> => {
  const createdBlog = await createBlog(app);
  const defaultPostData: TPostInputDto = getPostDto(createdBlog.id);

  const testPostData = { ...defaultPostData, ...postDto };

  const updatedPostResponse = await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(EHttpStatus.NoContent_204);

  return updatedPostResponse.body;
};
