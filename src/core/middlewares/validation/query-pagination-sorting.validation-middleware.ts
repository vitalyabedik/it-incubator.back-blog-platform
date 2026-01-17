import { query } from 'express-validator';
import {
  ESortDirection,
  MAX_PAGE_SIZE,
  paginationAndSortingDefault,
} from '../../constants/paginationAndSort';
import {
  EValidationPaginationAndSort,
  FIELD_REQUIRED_LENGTH,
} from '../../constants/validation';
import { paginationAndSortErrorMessages } from '../../constants/texts';

export const paginationAndSortingValidation = <T extends string>(
  sortFieldsEnum: Record<string, T>,
) => {
  const allowedSortFields = Object.values(sortFieldsEnum);

  return [
    query(EValidationPaginationAndSort.PAGE_NUMBER)
      .default(paginationAndSortingDefault.pageNumber)
      .isInt({ min: FIELD_REQUIRED_LENGTH })
      .withMessage(paginationAndSortErrorMessages.pageNumberInt)
      .toInt(),

    query(EValidationPaginationAndSort.PAGE_SIZE)
      .default(paginationAndSortingDefault.pageSize)
      .isInt({ min: FIELD_REQUIRED_LENGTH, max: MAX_PAGE_SIZE })
      .withMessage(paginationAndSortErrorMessages.pageSizeRange)
      .toInt(),

    query(EValidationPaginationAndSort.SORT_BY)
      .default(paginationAndSortingDefault.sortBy)
      .isIn(allowedSortFields)
      .withMessage(paginationAndSortErrorMessages.sortByValues),

    query(EValidationPaginationAndSort.SORT_DIRECTION)
      .default(paginationAndSortingDefault.sortDirection)
      .isIn(Object.values(ESortDirection))
      .withMessage(paginationAndSortErrorMessages.sortDirectionValues),
  ];
};
