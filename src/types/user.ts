export type TRole = 'USER' | 'ADMIN';

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: TRole;
  createdAt: string;
  updatedAt: string;
};
