import { Filter } from 'mongodb';
import { TUser } from '../../domain/user';
import { TUserQueryInput } from '../../routes/input/user-query.input';

type TUserFilter = Filter<TUser> & {
  login?: {
    $regex: string;
    $options: string;
  };
  email?: {
    $regex: string;
    $options: string;
  };
};

export const createUserFilter = (queryDto: TUserQueryInput): TUserFilter => {
  const { searchLoginTerm, searchEmailTerm } = queryDto;
  const filter: TUserFilter = {};

  if (searchLoginTerm) {
    filter.login = { $regex: searchLoginTerm, $options: 'i' };
  }

  if (searchEmailTerm) {
    filter.email = { $regex: searchEmailTerm, $options: 'i' };
  }

  return filter;
};
