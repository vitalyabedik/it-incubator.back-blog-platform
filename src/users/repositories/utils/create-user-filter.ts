import { Filter } from 'mongodb';
import { TUserDB } from '../../domain/userDB';
import { TUserQueryInput } from '../../routes/input/user-query.input';

type TUserFilter = Filter<TUserDB> & {
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
  const searchFilter: TUserFilter[] = [];

  if (searchLoginTerm) {
    searchFilter.push({
      login: { $regex: searchLoginTerm, $options: 'i' },
    });
  }

  if (searchEmailTerm) {
    searchFilter.push({
      email: { $regex: searchEmailTerm, $options: 'i' },
    });
  }

  if (searchFilter.length > 0) {
    filter.$or = searchFilter;
  }

  return filter;
};
