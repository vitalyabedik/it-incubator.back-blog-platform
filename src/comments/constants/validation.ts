export const COMMENT_CONTENT_MIN_FIELD_LENGTH = 20;
export const COMMENT_CONTENT_MAX_FIELD_LENGTH = 300;

export const validationMessages = {
  contentType: 'name должен быть строкой',
  contentLength: 'некорректная длина поля name',
  createdAtType: 'createdAt должен быть в формате DATE ISO STRING',
  noAccess: 'Недостаточно прав для изменения комментария',
};
