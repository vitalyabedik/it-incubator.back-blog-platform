import { EResultStatus } from '../constants/resultCode';

type TExtension = {
  field: string | null;
  message: string;
};

export type TResult<T = null> = {
  status: EResultStatus;
  errorMessage?: string;
  extensions: TExtension[];
  data: T;
};
