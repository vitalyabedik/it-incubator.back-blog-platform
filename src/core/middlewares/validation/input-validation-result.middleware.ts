import { NextFunction, Request, Response } from 'express';
import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import { TFieldError } from '../../types/error';
import { EHttpStatus } from '../../constants/http';

const formatErrors = (error: ValidationError): TFieldError => {
  const { path, msg } = error as unknown as FieldValidationError;

  return {
    field: path,
    message: msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(EHttpStatus.BAD_REQUEST_400).json({ errorsMessages: errors });
    return;
  }

  next();
};
