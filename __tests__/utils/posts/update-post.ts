import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { EHttpStatus } from '../../../src/core/constants/http';
import { TPostInputDto } from '../../../src/posts/dto/posts.input-dto';
import { createBlog } from '../blogs/create-blog';
import { getPostDto } from './get-post-dto';

type TUpdatePostArgs = {
  app: Express;
  authToken: string;
  postId: string;
  postDto?: TPostInputDto;
};

export const updatePost = async ({
  app,
  authToken,
  postId,
  postDto,
}: TUpdatePostArgs): Promise<void> => {
  const createdBlog = await createBlog({ app, authToken });
  const defaultPostData: TPostInputDto = getPostDto(createdBlog.id);

  const testPostData = { ...defaultPostData, ...postDto };

  const updatedPostResponse = await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', authToken)
    .send(testPostData)
    .expect(EHttpStatus.NO_CONTENT_204);

  return updatedPostResponse.body;
};
