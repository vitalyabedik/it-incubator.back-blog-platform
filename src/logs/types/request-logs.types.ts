import { HydratedDocument } from 'mongoose';

export type TRequestLog = {
  ip: string;
  url: string;
  date: Date;
};

export type TRequestLogDocument = HydratedDocument<TRequestLog>;
