export const BLOG_NAME_MAX_FIELD_LENGTH = 15;
export const BLOG_DESCRIPTION_MAX_FIELD_LENGTH = 500;
export const BLOG_WEBSITE_URL_MAX_FIELD_LENGTH = 100;

export const validationMessages = {
  nameType: 'name должен быть строкой',
  nameLength: 'некорректная длина поля name',
  descriptionType: 'description должен быть строкой',
  descriptionLength: 'некорректная длина поля description',
  createdAtType: 'createdAt должен быть в формате DATE ISO STRING',
  isMembershipType: 'isMembership должен быть булевым значением',
  websiteUrlType: 'websiteUrl должен быть строкой',
  websiteUrlLength: 'некорректная длина поля websiteUrl',
  websiteUrlPattern:
    'websiteUrl должен начинаться с https://, содержать только буквы, цифры, _, - в домене и пути',
};
