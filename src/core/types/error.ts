export type TAPIErrorResult = {
  errorsMessages: TFieldError[];
};

export type TFieldError = {
  field: string;
  message: string;
};

export type TBaseFieldErrorMessage = {
  dataType: string;
};
