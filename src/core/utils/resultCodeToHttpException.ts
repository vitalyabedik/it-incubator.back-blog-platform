import { EHttpStatus } from '../constants/http';
import { EResultStatus } from '../constants/resultCode';

export const resultCodeToHttpException = (
  resultCode: EResultStatus,
): number => {
  switch (resultCode) {
    case EResultStatus.Success:
      return EHttpStatus.OK_200;
    case EResultStatus.BadRequest:
      return EHttpStatus.BAD_REQUEST_400;
    case EResultStatus.Unauthorized:
      return EHttpStatus.UNAUTHORIZED_401;
    case EResultStatus.Forbidden:
      return EHttpStatus.FORBIDDEN_403;
    case EResultStatus.NotFound:
      return EHttpStatus.NOT_FOUND_404;
    default:
      return EHttpStatus.INTERNAL_SERVER_ERROR_500;
  }
};
