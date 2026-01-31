import { Request } from 'express';
import { TId } from './id';

export type TRequestWithoutAll = Request<{}, {}, {}, {}>;
export type TRequestWithBody<B> = Request<{}, {}, B>;
export type TRequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type TRequestWithParams<P> = Request<P>;
export type TRequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type TRequestWithParamsAndBody<P, B> = Request<P, {}, B>;

export type TRequestWithParamsAndBodyAndUserId<P, B, U extends TId> = Request<
  P,
  {},
  B,
  {},
  U
>;
export type TRequestWithBodyAndUserId<B, U extends TId> = Request<
  {},
  {},
  B,
  {},
  U
>;
export type TRequestWithUserId<U extends TId> = Request<{}, {}, {}, {}, U>;
