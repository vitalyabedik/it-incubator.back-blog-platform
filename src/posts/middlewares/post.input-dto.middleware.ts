import {
  postByBlogIdInputDtoValidation,
  postInputDtoValidation,
} from '../routers/validation/post.input-dto.validation';

export const postInputDtoMiddleware = [...postInputDtoValidation];

export const postByBlogIdInputDtoMiddleware = [
  ...postByBlogIdInputDtoValidation,
];
