import { Request } from 'express';

export type TRequestWithoutAll = Request<{}, {}, {}, {}>;
export type TRequestWithBody<B> = Request<{}, {}, B>;
export type TRequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type TRequestWithParams<P> = Request<P>;
export type TRequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type TRequestWithParamsAndBody<P, B> = Request<P, {}, B>;
