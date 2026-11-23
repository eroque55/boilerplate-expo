import { TUser } from './user';

export type TTokenPair = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

export type TAuthSession = TTokenPair & {
  user: TUser;
};

export type TRegisterInput = {
  name: string;
  email: string;
  password: string;
};
