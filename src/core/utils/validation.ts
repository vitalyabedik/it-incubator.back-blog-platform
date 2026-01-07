import { TAPIErrorResult, TFieldError } from '../types/error';

export const createErrorMessages = (
  errors: TFieldError[],
): TAPIErrorResult => ({
  errorsMessages: errors,
});
