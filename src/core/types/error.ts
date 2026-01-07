export type TAPIErrorResult<T> = {
  errorsMessages: TFieldError<T>[];
};

export type TFieldError<T> = {
  field: T;
  message: string;
};

export type TBaseFieldErrorMessage = {
  dataType: string;
};
