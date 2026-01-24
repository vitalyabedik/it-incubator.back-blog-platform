export const USER_LOGIN_MIN_FIELD_LENGTH = 3;
export const USER_LOGIN_MAX_FIELD_LENGTH = 10;
export const USER_PASSWORD_MIN_FIELD_LENGTH = 6;
export const USER_PASSWORD_MAX_FIELD_LENGTH = 20;

export const validationMessages = {
  loginType: 'login должен быть строкой',
  loginLength: 'некорректная длина поля login',
  loginPattern:
    'login должен содержать буквы A-Z, a-z, цифры 0-9, дефис (-) и подчеркивание (_)',
  loginUnique: 'login должен быть уникальным',
  passwordType: 'password должен быть строкой',
  passwordLength: 'некорректная длина поля password',
  emailType: 'email должен быть строкой',
  emailLength: 'некорректная длина поля email',
  emailPattern:
    'проверьте формат email. Пример правильного формата: name@domain.com',
  emailUnique: 'email должен быть уникальным',
};

export enum EUserValidationFilter {
  SEARCH_LOGIN_TERM = 'searchLoginTerm',
  SEARCH_EMAIL_TERM = 'searchEmailTerm',
}
