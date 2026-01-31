import { ESortDirection, MAX_PAGE_SIZE } from './paginationAndSort';
import { FIELD_REQUIRED_LENGTH } from './validation';

export const paramsErrorMessages = {
  /**
   * id
   */
  idRequired: `id обязательно для заполнения`,
  idStringType: `id должно быть строкой`,
  idObjectIdType: `некорректный формат ObjectId для id`,
  /**
   * blogId
   */
  blogIdRequired: `blogId обязательно для заполнения`,
  blogIdStringType: `blogId должно быть строкой`,
  blogIdObjectIdType: `некорректный формат ObjectId для blogId`,
  /**
   * postId
   */
  postIdRequired: `postId обязательно для заполнения`,
  postIdStringType: `postId должно быть строкой`,
  postIdObjectIdType: `некорректный формат ObjectId для postId`,
  /**
   * commentId
   */
  commentIdRequired: `commentId обязательно для заполнения`,
  commentIdStringType: `commentId должно быть строкой`,
  commentIdObjectIdType: `некорректный формат ObjectId для commentId`,
};

export const paginationAndSortErrorMessages = {
  pageNumberInt: 'Значение pageNumber должно быть положительным числом',
  pageSizeRange: `Значение pageSize должно в промежутке от ${FIELD_REQUIRED_LENGTH} до ${MAX_PAGE_SIZE}`,
  sortByValues: `Некорректное значение поля sortBy.`,
  sortDirectionValues: `Значение поля sortDirection должно быть одно из: ${Object.values(ESortDirection).join(', ')}.`,
};
