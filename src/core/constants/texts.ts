import { ESortDirection, MAX_PAGE_SIZE } from './paginationAndSort';
import { FIELD_REQUIRED_LENGTH } from './validation';

export const paramsErrorMessages = {
  idRequired: 'ID обязательно для заполнения',
  idStringType: 'ID должно быть строкой',
  idObjectIdType: 'некорректный формат ObjectId',
};

export const paginationAndSortErrorMessages = {
  pageNumberInt: 'Значение pageNumber должно быть положительным числом',
  pageSizeRange: `Значение pageSize должно в промежутке от ${FIELD_REQUIRED_LENGTH} до ${MAX_PAGE_SIZE}`,
  sortByValues: `Некорректное значение поля sortBy.`,
  sortDirectionValues: `Значение поля sortDirection должно быть одно из: ${Object.values(ESortDirection).join(', ')}.`,
};
