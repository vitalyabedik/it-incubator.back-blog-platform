import { TAPIErrorResult, TFieldError } from '../types/error';

export const createErrorMessages = <T>(
  errors: TFieldError<T>[],
): TAPIErrorResult<T> => ({
  errorsMessages: errors,
});
